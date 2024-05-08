default: dev

dev:
    php artisan serve & npm run dev & just lint

check:
    find app/ resources/ routes/ database/ tests/ phpstan.neon | entr -s 'composer run check'

lint:
    find app/ resources/ routes/ database/ tests/ phpstan.neon | entr -s 'composer run lint'

secrets:
    fly secrets import < .env.production

deploy:
    fly deploy
