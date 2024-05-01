default: dev

dev:
    find app/ resources/ routes/ database/ tests/ phpstan.neon | entr -s 'composer run check'
