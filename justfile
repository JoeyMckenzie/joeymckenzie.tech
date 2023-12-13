default: pail

# runs tail logging
pail:
    artisan pail

# syncs content to the database
sync:
    artisan app:sync-content

# continuously runs lint on file change
lint:
    fswatch -o app/ | xargs -n1 -I{} sh -c "composer run lint"


