alias b := build
host := `uname -a`

# build main
build:
    pnpm run build

# run the Contentlayer and SvelteKit dev servers
dev:
    pnpm run dev

# refresh dependencies and build artifacts
refresh:
    rm -rf node_modules bun.lockb && pnpm install && pnpm run build

# run code quality tools
ci:
    pnpm run ci

# test everything
test-all: build
    ./test --all

# run a specific test
test TEST: build
    ./test --test {{TEST}}