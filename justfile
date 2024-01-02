default: lint

# continuously runs lint on file change
lint:
    fswatch -o src/ | xargs -n1 -I{} sh -c "pnpm run check"
