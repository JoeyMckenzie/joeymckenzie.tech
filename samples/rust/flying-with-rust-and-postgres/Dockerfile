# All credit goes to https://fasterthanli.me/articles/remote-development-with-rust-on-fly-io#what-the-heck-is-fly-io-for-even
# for an an awesome walkthrough of Dockerfiles for rust, this is more or less a direct copy pasta with a few minor tweaks

# After containerization, this manages to come in at a whopping ~155mb, still a bit to we could optimize but this should do for now

# Stage one - copy over our build files for compilation, including workspace and .env files
FROM rust:1-slim-bullseye AS build

WORKDIR /app

COPY . .

# On rebuilds, we explicitly cache our rust build dependencies to speed things up
RUN --mount=type=cache,target=/app/target \
    --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/usr/local/cargo/git \
    --mount=type=cache,target=/usr/local/rustup \
    set -eux; \
    # We'll use nightly because we like to go fast and break things
    rustup install nightly; \
    cargo build --release; \
    # Compress debug symbols, squeezing the size just a bit more
    objcopy --compress-debug-sections target/release/flying-with-rust-and-postgres ./server

# Stage two - we'll utilize a second container to run our built binary from our first container - slim containers!
FROM debian:bullseye-slim as deploy

# Let's install all the necessary runtime tools on the container
RUN set -eux; \
    export DEBIAN_FRONTEND=noninteractive; \
    apt update; \
    apt install -y --no-install-recommends bind9-dnsutils iputils-ping iproute2 curl ca-certificates htop; \
    apt clean autoclean; \
    apt autoremove -y; \
    rm -rf /var/lib/{apt,dpkg,cache,log}/;

# Let's work from a self contained directory for all of our deployment needs
WORKDIR /deploy

# We need the artifact from the build container, so let's grab it
COPY --from=build /app/server ./

# Let's expose port 80 as we'll need fly's internal port mapping also assumes 80
EXPOSE 80
EXPOSE 443

# Finally, boot up the API
CMD ["./server"]