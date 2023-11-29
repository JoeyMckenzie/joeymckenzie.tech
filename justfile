alias b := build

default: dev

# build main
build:
    pnpm run build

# run the Contentlayer and SvelteKit dev servers
dev:
    pnpm run dev

# refresh dependencies and build artifacts
format:
    pnpm run fmt

# refresh dependencies and build artifacts
refresh:
    rm -rf node_modules pnpm-lock.yml && pnpm install && pnpm run build

# run code quality tools
ci:
    pnpm run ci

# deploy to fly
deploy:
    fly deploy --build-arg BUILD_COMMIT_SHA=$(git rev-parse HEAD)

# import secrets to fly
secrets:
    fly secrets import < .env.production
