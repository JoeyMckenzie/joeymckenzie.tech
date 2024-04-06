default: watch

watch:
    cargo leptos watch

content:
    cargo build --bin content --features content

tailwind:
    npx tailwindcss -i ./styles/tailwind.css -o ./styles/main.css --watch

fmt:
    leptosfmt src/**/*.rs

docker-build:
    docker build -t blog:latest .

docker-run:
    docker run -d --name blog -p 8080:8080 --env-file ./.env blog:latest

docker-stop:
    docker stop blog

docker-rm:
    docker rm blog

docker-restart: docker-stop docker-rm docker-build docker-run
