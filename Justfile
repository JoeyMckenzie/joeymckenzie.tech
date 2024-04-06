default: watch

watch:
    cargo leptos watch

tailwind:
    npx tailwindcss -i ./styles/tailwind.css -o ./styles/main.css --watch