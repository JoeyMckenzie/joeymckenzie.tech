default: clippy

# continuously lint with clippy
clippy:
    cargo watch -x clippy

# continuously run the dev server
run:
    cargo watch -x "run --bin server"

# continuously run the dev server
dev:
    find src/ | entr -s 'npm run build'

# run content sync
content:
    cargo run --bin content

# builds the docker container with all relevant environment variables
docker-build:
    docker build -t blog:latest .

docker-run:
    docker run -d --name blog -p 8080:8080 --env-file ./.env blog:latest

docker-stop:
    docker stop blog

docker-rm:
    docker rm blog

docker-restart: docker-stop docker-rm docker-build docker-run

secrets:
    fly secrets import < .env.production
