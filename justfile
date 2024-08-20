set windows-shell := ["pwsh.exe", "-c"]
set shell := ["zsh", "-c"]
set dotenv-load

# Default recipe
default: dev

# Development workflow
dev:
    cargo leptos watch & find src/ | entr -s 'just fmt && npm run tailwind:compile'

# Formatting
fmt: leptosfmt
    cargo fmt

leptosfmt:
    leptosfmt src/*.rs src/**/*.rs

lint: lint-app lint-content 

lint-app:
    cargo clippy --package=blog --lib --no-default-features --features=ssr,hydrate
    
lint-content:
    cargo clippy --bin content --no-default-features --features=content

# Build
build: assets
    cargo leptos build --release -vv

# Compile Tailwind CSS
assets:
    npm run tailwind:compile

# Content generation
content:
    cargo run --bin content --features content

# Prepare SQLx
prepare:
    cargo sqlx prepare -- --all-targets --all-features

# Deploy
deploy:
    fly deploy \
      --build-arg SPOTIFY_REFRESH_TOKEN=${SPOTIFY_REFRESH_TOKEN} \
      --build-arg SPOTIFY_CLIENT_ID=${SPOTIFY_CLIENT_ID} \
      --build-arg SPOTIFY_CLIENT_SECRET=${SPOTIFY_CLIENT_SECRET} \
      --build-arg APP_URL=${APP_URL} \
      --build-arg COMMIT_SHA=${COMMIT_SHA} \
      --build-arg DATABASE_URL=${DATABASE_URL}

# Docker build
docker-build:
    docker build \
      --build-arg SPOTIFY_REFRESH_TOKEN=${SPOTIFY_REFRESH_TOKEN} \
      --build-arg SPOTIFY_CLIENT_ID=${SPOTIFY_CLIENT_ID} \
      --build-arg SPOTIFY_CLIENT_SECRET=${SPOTIFY_CLIENT_SECRET} \
      --build-arg APP_URL=${APP_URL} \
      --build-arg DATABASE_URL=${DATABASE_URL} \
      -t blog:latest .

# Docker run
docker-run:
    docker run -d --name blog -p 8080:8080 --env-file ./.env blog:latest

# Docker stop
docker-stop:
    docker stop blog

# Docker remove
docker-rm:
    docker rm blog

# Docker restart
docker-restart: docker-stop docker-rm docker-build docker-run

# Prepare git hooks
prepare-hooks:
    git config core.hookspath .githooks

# Import secrets to Fly.io
secrets:
    fly secrets import < .env.production