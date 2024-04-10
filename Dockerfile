ARG NODE_VERSION=21.6.2


# Build frontent assests
FROM node:${NODE_VERSION} as node_modules_go_brrr

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
FROM rustlang/rust:nightly-bullseye as builder

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

# Build the app
RUN cargo leptos build --release -vv

# Build sitemap
RUN cargo run --bin sitemap --no-default-features --features sitemap


# Deployment container
FROM rustlang/rust:nightly-bullseye as runner

# Copy the server binary to the /app directory
COPY --from=builder /app/target/release/blog /app/

# /target/site contains our JS/WASM/CSS, etc.
COPY --from=builder /app/target/site /app/site

# Copy Cargo.toml if it’s needed at runtime
COPY --from=builder /app/Cargo.toml /app/

WORKDIR /app

# Set any required env variables
ENV RUST_LOG="info"
ENV LEPTOS_SITE_ADDR="0.0.0.0:8080"
ENV LEPTOS_SITE_ROOT="site"

EXPOSE 8080
EXPOSE 443

# Run the server
CMD ["/app/blog"]
