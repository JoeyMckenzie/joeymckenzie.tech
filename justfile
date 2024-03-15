default: lint

# install dependencies for React and Laravel
dev:
    npm run dev & php artisan serve

# refresh the database and run migrations
migrate:
    php artisan migrate:fresh && php artisan content:sync

# install dependencies for React and Laravel
install:
    rm -rf node_modules package-lock.json && npm install

# refresh dependencies for React and Laravel
refresh: install
    rm -rf vendor composer.lock && composer install

# runs the ssr server
ssr:
    rm -rf bootstrap/ssr/ && npm run build && php artisan inertia:start-ssr

# check types on any file change
lint:
    find app/ tests/ database/ routes/ | entr -s 'composer run lint'

# check types on any file change
lint-js:
    find resources/ | entr -s 'npm run lint:check'

# rerun the build process on any file system changes
build-js:
    find resources/ | entr -s 'npm run build'

# run tests in parallel
test:
    find app/ tests/ | entr -s 'composer run test'

# keep ourselves honest, practice safe CI
ci:
    npm run pre-commit && composer run ci

# import secrets into our fly instance
secrets:
    fly secrets import < .env.production
