default: pail

# runs tail logging
pail:
    php artisan pail

# syncs content to the database
sync:
    php artisan app:sync-content

# continuously runs lint on file change
lint:
    fswatch -o app/ | xargs -n1 -I{} sh -c "composer run lint"


