default: install

install:
    rm -rf node_modules/ .nuxt/ .netlify/ dist/ pnpm-lock.yaml; \
    pnpm install; \
    pnpm run build
