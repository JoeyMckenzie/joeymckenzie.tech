default: dev

dev:
    pnpm run dev

install:
    rm -rf node_modules pnpm-lock.yaml && pnpm install

build:
    rm -rf .next && pnpm run build

preview: build
    pnpm run start

lint:
    fswatch -o src/ | xargs -n1 -I{} sh -c "pnpm run lint"
