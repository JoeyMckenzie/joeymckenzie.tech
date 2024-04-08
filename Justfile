default: dev

dev:
    just watch & find src/ | entr -s 'just fmt'

watch:
    cargo leptos watch

content:
    cargo build --bin content --features content

sitemap:
    cargo run --bin sitemap --features sitemap

fmt:
    leptosfmt src/**/*.rs

deploy:
    fly deploy

docker-build:
    docker build -t blog:latest .

docker-run:
    docker run -d --name blog -p 8080:8080 --env-file ./.env blog:latest

docker-stop:
    docker stop blog

docker-rm:
    docker rm blog

docker-restart: docker-stop docker-rm docker-build docker-run
