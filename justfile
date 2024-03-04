default: pail

# install dependencies for React and Laravel
dev:
    pnpm run dev & php artisan serve

# install dependencies for React and Laravel
install:
    rm -rf node_modules pnpm-lock.yaml && pnpm install

# refresh dependencies for React and Laravel
refresh: install
    rm -rf vendor composer.lock && composer install

# runs tail logging
pail:
    php artisan pail

# runs the ssr server
ssr:
    rm -rf bootstrap/ssr/ && pnpm run build && php artisan inertia:start-ssr

# check types on any file change
lint:
    find app/ tests/ database/ | entr -s 'composer run lint'

# check types on any file change
lint-js:
    find resources/ | entr -s 'pnpm run lint'

# run tests in parallel
test:
    find app/ tests/ | entr -s 'composer run test'

# keep ourselves honest, practice safe CI
ci:
    pnpm run ci && composer run ci
