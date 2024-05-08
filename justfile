default: dev

dev:
    php artisan serve & npm run dev

lint:
    find app/ resources/ routes/ database/ tests/ phpstan.neon | entr -s 'composer run check'

secrets:
    fly secrets import < .env.production

deploy:
    fly deploy
