ARG RUST_VERSION=1.72.0
ARG NODE_VERSION=20
ARG DEBIAN_VERSION=11.7

# all credit goes to https://fasterthanli.me/articles/remote-development-with-rust-on-fly-io#what-the-heck-is-fly-io-for-even
# for an an awesome walkthrough of docker files for rust, this is more or less a direct copy pasta with a few minor tweaks

# after containerization, this manages to come in at a whopping ~107mb, still a bit to we could optimize but this should do for now

# stage zero - next, we'll compile all of our css to copy over into the output container
FROM node:${NODE_VERSION}-slim as node

WORKDIR /app

COPY ./styles ./styles
COPY ./templates ./templates
COPY ./package.json ./
COPY ./tailwind.config.js ./

RUN npm install; \
    npx tailwindcss -i ./styles/globals.css -o main.css;

# stage one - copy over our build files for compilation, including workspace and .env files
FROM rust:${RUST_VERSION}-slim-bullseye AS build

WORKDIR /app

# note: all the sample crates are required as we're in the context of a workspace
# though only for the build step as we'll only use the crate that gets deployed
# to fly as the crate that runs in the runtime container
# COPY ./examples ./examples
# COPY ./sqlx-data.json ./sqlx-data.json
# COPY ./migrations ./migrations
COPY ./rust-toolchain.toml ./
COPY ./Cargo.toml ./
COPY ./build.rs ./
COPY ./src ./src
COPY ./scripts/htmx.sh ./scripts/htmx.sh

ENV COMPILE_STYLES=false

# on rebuilds, we explicitly cache our rust build dependencies to speed things up
RUN --mount=type=cache,target=/app/target \
    --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/usr/local/cargo/git \
    --mount=type=cache,target=/usr/local/rustup \
    set -eux; \
    export DEBIAN_FRONTEND=noninteractive; \
    apt update; \
    apt install --yes curl pkg-config libssl-dev; \
    apt clean autoclean; \
    apt autoremove --yes; \
    rustup install nightly; \
    cargo build --release; \
    objcopy --compress-debug-sections target/release/joey-mckenzie-tech ./server

# we'll set these environment variables during the build step, both locally and in our Fly instance
ARG SPOTIFY_REFRESH_TOKEN=""
ARG SPOTIFY_CLIENT_ID=""
ARG SPOTIFY_CLIENT_SECRET=""
ARG DATABASE_URL=""
ARG RUST_ENV=""
ARG PORT=""
ARG BASE_URL=""

# create a .env file for loading variables
RUN echo "\n\
    SPOTIFY_REFRESH_TOKEN=${SPOTIFY_REFRESH_TOKEN}\n\
    SPOTIFY_CLIENT_ID=${SPOTIFY_CLIENT_ID}\n\
    SPOTIFY_CLIENT_SECRET=${SPOTIFY_CLIENT_SECRET}\n\
    RUST_ENV=${RUST_ENV}\n\
    PORT=${PORT}\n\
    BASE_URL=${BASE_URL}\n\
    DATABASE_URL=${DATABASE_URL}" > ./.env

# stage three - we'll utilize a second container to run our built binary from our first container - slim containers!
FROM debian:${DEBIAN_VERSION}-slim as deploy

RUN set -eux; \
    export DEBIAN_FRONTEND=noninteractive; \
    apt update; \
    apt install --yes --no-install-recommends openssl ca-certificates; \
    apt clean autoclean; \
    apt autoremove --yes; \
    rm -rf /var/lib/{apt,dpkg,cache,log}/

WORKDIR /deploy

# copy over build artifacts from the build stage
# COPY ./config ./config
COPY ./content ./content
COPY ./assets ./assets
COPY --from=build /app/server ./
COPY --from=build /app/.env ./
COPY --from=node /app/templates /deploy/templates
COPY --from=node /app/main.css /deploy/assets/css/main.css

EXPOSE 80
EXPOSE 443

CMD ["./server"]
