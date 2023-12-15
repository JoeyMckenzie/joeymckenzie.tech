default: pail

# runs tail logging
pail:
    php artisan pail

# syncs content to the database
sync:
    php artisan content:sync

# syncs content to the database
migrate:
    php artisan migrate:fresh && php artisan content:sync

# runs the ssr server
ssr:
    pnpm run build && php artisan inertia:start-ssr

# continuously runs lint on file change
lint-php:
    fswatch -o app/ | xargs -n1 -I{} sh -c "composer run lint"

# continuously runs lint on file change
lint-react:
    fswatch -o resources/js | xargs -n1 -I{} sh -c "pnpm run lint"


