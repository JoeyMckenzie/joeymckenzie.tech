default: pail

# runs tail logging
pail:
    php artisan pail

# syncs content to the database
sync:
    php artisan app:sync-content

# runs the ssr server
ssr:
    pnpm run build && php artisan inertia:start-ssr

# continuously runs lint on file change
lint:
    fswatch -o app/ | xargs -n1 -I{} sh -c "composer run lint"


