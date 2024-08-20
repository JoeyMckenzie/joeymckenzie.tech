ARG NODE_VERSION=21.6.2


# Build frontent assests
FROM node:${NODE_VERSION} AS node_modules_go_brrr

RUN mkdir /app
RUN mkdir -p /app
WORKDIR /app

# Copy over JS-specific files for tailwind, including the Rust source files for tailwind to analyze content for treeshaking
COPY ./src ./src
COPY ./package.json .
COPY ./package-lock.json .
COPY ./styles/tailwind.css ./styles/tailwind.css
COPY ./tailwind.config.js .

RUN npm ci --no-audit; \
    npm run build; \
    npx tailwindcss -i ./styles/tailwind.css -o ./styles/main.css;


# Get started with a build env with Rust nightly
FROM rustlang/rust:nightly-bullseye AS builder

# If you’re using stable, use this instead
# FROM rust:1.74-bullseye as builder

# Install cargo-binstall, which makes it easier to install other
# cargo extensions like cargo-leptos
RUN wget https://github.com/cargo-bins/cargo-binstall/releases/latest/download/cargo-binstall-x86_64-unknown-linux-musl.tgz
RUN tar -xvf cargo-binstall-x86_64-unknown-linux-musl.tgz
RUN cp cargo-binstall /usr/local/cargo/bin

# Install cargo-leptos
RUN cargo binstall cargo-leptos -y

# Add the WASM target
RUN rustup target add wasm32-unknown-unknown

# Make an /app dir, which everything will eventually live in
RUN mkdir -p /app
WORKDIR /app
COPY . .

# Copy tailwind output over
COPY --from=node_modules_go_brrr /app/styles/main.css /app/styles/main.css

# We'll set these environment variables during the build step, both locally and in our Fly instance
ARG SPOTIFY_REFRESH_TOKEN=""
ARG SPOTIFY_CLIENT_ID=""
ARG SPOTIFY_CLIENT_SECRET=""
ARG DATABASE_URL=""
ARG APP_URL=""
ARG COMMIT_SHA=""

# Create a .env file for loading variables
RUN echo "\
    SPOTIFY_REFRESH_TOKEN=${SPOTIFY_REFRESH_TOKEN}\n\
    SPOTIFY_CLIENT_ID=${SPOTIFY_CLIENT_ID}\n\
    SPOTIFY_CLIENT_SECRET=${SPOTIFY_CLIENT_SECRET}\n\
    APP_URL=${APP_URL}\n\
    COMMIT_SHA=${COMMIT_SHA}\n\
    DATABASE_URL=${DATABASE_URL}" > ./.env

# Build the app
RUN cargo leptos build --release -vv


# Deployment container
FROM rustlang/rust:nightly-bullseye AS runner

# Copy the server binary to the /app directory
COPY --from=builder /app/target/release/blog /app/

# /target/site contains our JS/WASM/CSS, etc.
COPY --from=builder /app/target/site /app/site

# Copy Cargo.toml if it’s needed at runtime
COPY --from=builder /app/Cargo.toml /app/

# Copy the .env file over
COPY --from=builder /app/.env /app/

WORKDIR /app

# Set any required env variables
ENV RUST_LOG="info"
ENV LEPTOS_SITE_ADDR="0.0.0.0:8080"
ENV LEPTOS_SITE_ROOT="site"

EXPOSE 8080
EXPOSE 443

# Run the server
CMD ["/app/blog"]
