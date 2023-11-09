alias b := build
host := `uname -a`

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

# lint rust examples
clippy:
    cargo clippy

# format rust examples
format-rust:
    cargo fmt

# build rust examples
build-rust:
    cargo build

# run code quality tools
ci:
    pnpm run ci

# test everything
test-all: build
    ./test --all

# run a specific test
test TEST: build
    ./test --test {{TEST}}
