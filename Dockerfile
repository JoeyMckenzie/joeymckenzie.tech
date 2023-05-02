ARG RUST_VERSION=1.69.0
ARG DEBIAN_VERSION=11.6

# all credit goes to https://fasterthanli.me/articles/remote-development-with-rust-on-fly-io#what-the-heck-is-fly-io-for-even
# for an an awesome walkthrough of docker files for rust, this is more or less a direct copy pasta with a few minor tweaks

# after containerization, this manages to come in at a whopping ~163mb, still a bit to we could optimize but this should do for now

# stage one - copy over our build files for compilation, including workspace and .env files
FROM rust:${RUST_VERSION}-slim-bullseye AS build

WORKDIR /app

COPY ./rust-toolchain ./
COPY ./Cargo.toml ./
# note: all the sample crates are required as we're in the context of a workspace
# though only for the build step as we'll only use the crate that gets deployed
# to fly as the crate that runs in the runtime container
COPY ./samples ./samples
COPY ./src ./src
COPY ./scripts/install.sh ./

# we need to install a few tools as root, so change the user to root so we can "sudo" commands
USER root

# install protoc before building our crates, as our examples involve some shuttle samples
RUN set -eux; \
    export DEBIAN_FRONTEND=noninteractive; \
    apt update; \
    apt install --yes curl unzip pkg-config libssl-dev sudo; \
    apt clean autoclean; \
    apt autoremove --yes; \
    ./install.sh;

# on rebuilds, we explicitly cache our rust build dependencies to speed things up
RUN --mount=type=cache,target=/app/target \
    --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/usr/local/cargo/git \
    --mount=type=cache,target=/usr/local/rustup \
    set -eux; \
    rustup install nightly; \
    cargo build --workspace --release; \
    objcopy --compress-debug-sections target/release/joey-mckenzie-tech ./server

# stage two - we'll utilize a second container to run our built binary from our first container - slim containers!
FROM debian:${DEBIAN_VERSION}-slim as deploy

RUN set -eux; \
    export DEBIAN_FRONTEND=noninteractive; \
    apt update; \
    apt install --yes --no-install-recommends bind9-dnsutils iputils-ping iproute2 curl ca-certificates htop pkg-config libssl-dev; \
    apt clean autoclean; \
    apt autoremove --yes; \
    rm -rf /var/lib/{apt,dpkg,cache,log}/

WORKDIR /deploy

# copy over build artifacts from the build stage
COPY --from=build /app/server ./

# we'll set these environment variables during the build step, both locally and in our Fly instance
ARG SPOTIFY_REFRESH_TOKEN=""
ARG SPOTIFY_CLIENT_ID=""
ARG SPOTIFY_CLIENT_SECRET=""
ARG TIMEOUT_DURATION_SECONDS=""
ARG PORT=""
ARG LOG_LEVEL=""

# create a .env file for loading variables
RUN echo "\n\
    SPOTIFY_REFRESH_TOKEN=${SPOTIFY_REFRESH_TOKEN}\n\
    SPOTIFY_CLIENT_ID=${SPOTIFY_CLIENT_ID}\n\
    SPOTIFY_CLIENT_SECRET=${SPOTIFY_CLIENT_SECRET}\n\
    TIMEOUT_DURATION_SECONDS=${TIMEOUT_DURATION_SECONDS}\n\
    PORT=${PORT}\n\
    LOG_LEVEL=${LOG_LEVEL}" > ./.env

EXPOSE 80
EXPOSE 443

CMD ["./server"]