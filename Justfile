default: dev

dev:
    just watch & find src/ | entr -s 'just fmt && npm run tailwind:compile'

watch:
    cargo leptos watch

content:
    cargo build --bin content --features content

sitemap:
    cargo run --bin sitemap --no-default-features --features sitemap

prepare:
    cargo sqlx prepare -- --all-targets --all-features

fmt:
    cargo fmt && leptosfmt src/*.rs src/**/*.rs

import:
    fly secrets import < .env.production

deploy:
    fly deploy

docker-build:
    sudo docker build -t blog:latest .

docker-run:
    sudo docker run -d --name blog -p 8080:8080 --env-file ./.env blog:latest

docker-stop:
    sudo docker stop blog

docker-rm:
    sudo docker rm blog

docker-restart: docker-stop docker-rm docker-build docker-run
