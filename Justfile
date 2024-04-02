set dotenv-load

default: clippy

# continuously lint with clippy
clippy:
    cargo watch -x clippy

# continuously run the dev server
run:
    cargo watch -x "run --bin server"

# run content sync
content:
    cargo run --bin content

# builds the docker container with all relevant environment variables
docker-build:
    docker build . \
        --build-arg \
        SPOTIFY_REFRESH_TOKEN=${SPOTIFY_REFRESH_TOKEN} \
        --build-arg \
        SPOTIFY_CLIENT_ID=${SPOTIFY_CLIENT_ID} \
        --build-arg \
        SPOTIFY_CLIENT_SECRET=${SPOTIFY_CLIENT_SECRET} \
        --build-arg \
        DATABASE_URL=${DATABASE_URL} \
        --build-arg \
        RUST_ENV=${RUST_ENV} \
        -t \
        blog

docker-run:
    docker run --env-file ./.env -it blog