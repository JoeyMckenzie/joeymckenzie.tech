ARG RUST_VERSION=1.72.0
ARG DEBIAN_VERSION=11.6
ARG NODE_VERSION=21.6.2

# all credit goes to https://fasterthanli.me/articles/remote-development-with-rust-on-fly-io#what-the-heck-is-fly-io-for-even
# for an an awesome walkthrough of docker files for rust, this is more or less a direct copy pasta with a few minor tweaks

# after containerization, this manages to come in at a whopping ~163mb, still a bit to we could optimize but this should do for now

# stage one - copy over our build files for compilation, including workspace and .env files
FROM rust:${RUST_VERSION}-slim-bullseye AS blazingly_fast_tm

RUN mkdir /app
RUN mkdir -p /app
WORKDIR /app

# we'll copy everything over, including all rust and TS/vue files since we're serving our vue app via tower/axum
COPY ./Cargo.lock .
COPY ./Cargo.toml .
COPY ./src ./src
COPY ./.sqlx ./.sqlx

# on rebuilds, we explicitly cache our rust build dependencies to speed things up
RUN set -eux; \
    export DEBIAN_FRONTEND=noninteractive; \
    apt update; \
    apt install --yes pkg-config libssl-dev curl; \
    apt clean autoclean; \
    apt autoremove --yes;

# build our server crate which'll also build the frontend assets
RUN --mount=type=cache,target=/app/target \
    --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/usr/local/cargo/git \
    --mount=type=cache,target=/usr/local/rustup \
    rustup install nightly; \
    cargo build --bin server --release; \
    objcopy --compress-debug-sections target/release/server ./server

# we'll set these environment variables during the build step, both locally and in our Fly instance
ARG SPOTIFY_REFRESH_TOKEN=""
ARG SPOTIFY_CLIENT_ID=""
ARG SPOTIFY_CLIENT_SECRET=""
ARG DATABASE_URL=""
ARG RUST_ENV=""

# create a .env file for loading variables
RUN echo "\n\
    SPOTIFY_REFRESH_TOKEN=${SPOTIFY_REFRESH_TOKEN}\n\
    SPOTIFY_CLIENT_ID=${SPOTIFY_CLIENT_ID}\n\
    SPOTIFY_CLIENT_SECRET=${SPOTIFY_CLIENT_SECRET}\n\
    RUST_ENV=${RUST_ENV}\n\
    DATABASE_URL=${DATABASE_URL}" > ./.env

# multi-stage build: Build static assets
# this allows us to not include Node within the final container
FROM node:${NODE_VERSION} as node_modules_go_brrr

RUN mkdir /app
RUN mkdir -p /app
WORKDIR /app

# we'll copy everything over, including all rust and TS/vue files since we're serving our vue app via tower/axum
COPY ./package.json .
COPY ./package-lock.json .
COPY ./vite.config.ts .
COPY ./public ./public
COPY ./src ./src
COPY ./tsconfig.* .
COPY ./index.html .
COPY /env.d.ts .

RUN npm ci --no-audit; \
    npm run build;

# stage two - we'll utilize a second container to run our built binary from our first container - slim containers!
FROM debian:${DEBIAN_VERSION}-slim as deploy

RUN set -eux; \
    export DEBIAN_FRONTEND=noninteractive; \
    apt update; \
    apt install --yes --no-install-recommends openssl ca-certificates; \
    apt clean autoclean; \
    apt autoremove --yes; \
    rm -rf /var/lib/{apt,dpkg,cache,log}/

RUN mkdir /app
RUN mkdir -p /app
WORKDIR /app

# copy over build artifacts from the build stage
COPY --from=blazingly_fast_tm /app/server ./
COPY --from=blazingly_fast_tm /app/.env ./
COPY --from=node_modules_go_brrr /app/dist ./dist

EXPOSE 80
EXPOSE 443

CMD ["./server"]
