default: dev

dev:
    php artisan serve & npm run dev & just lint

content:
    php artisan content:sync

check:
    find app/ resources/ routes/ database/ tests/ phpstan.neon | entr -s 'composer run check'

lint:
    find app/ resources/ routes/ database/ tests/ phpstan.neon | entr -s 'composer run lint'

test:
    find app/ resources/ routes/ database/ tests/ phpstan.neon | entr -s 'composer run test'

secrets:
    fly secrets import < .env.production

deploy:
    fly deploy

prepare:
    git config core.hookspath .githooks
