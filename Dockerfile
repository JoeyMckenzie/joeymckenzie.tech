# syntax = docker/dockerfile:experimental

# Default to PHP 8.2, but we attempt to match
# the PHP version from the user (wherever `flyctl launch` is run)
# Valid version values are PHP 7.4+
ARG PHP_VERSION=8.3
ARG NODE_VERSION=18
FROM fideloper/fly-laravel:${PHP_VERSION} as base

# PHP_VERSION needs to be repeated here
# See https://docs.docker.com/engine/reference/builder/#understand-how-arg-and-from-interact
ARG PHP_VERSION

LABEL fly_launch_runtime="laravel"

# copy application code, skipping files based on .dockerignore
COPY . /var/www/html

RUN composer install --optimize-autoloader --no-dev \
    && mkdir -p storage/logs \
    && php artisan optimize:clear \
    && chown -R www-data:www-data /var/www/html \
    && sed -i 's/protected \$proxies/protected \$proxies = "*"/g' app/Http/Middleware/TrustProxies.php \
    && echo "MAILTO=\"\"\n* * * * * www-data /usr/bin/php /var/www/html/artisan schedule:run" > /etc/cron.d/laravel \
    && cp .fly/entrypoint.sh /entrypoint \
    && chmod +x /entrypoint

# Multi-stage build: Build static assets
# This allows us to not include Node within the final container
FROM node:${NODE_VERSION} as node_modules_go_brrr

RUN mkdir /app

RUN mkdir -p  /app
WORKDIR /app
COPY . .
COPY --from=base /var/www/html/vendor /app/vendor

RUN corepack enable && corepack prepare pnpm@latest-8 --activate; \
    pnpm install --frozen-lockfile; \
    pnpm run build;

# From our base container created above, we
# create our final image, adding in static
# assets that we generated above
FROM base

ENV BUILD_COMMIT_SHA;

# For Inertia.js SSR, copy over the node binary
# so we can pass off rendering to the SSR process
COPY --from=node_modules_go_brrr /usr/local/bin/node /usr/local/bin/node
COPY --from=node_modules_go_brrr /app/node_modules /var/www/html/node_modules

# Packages like Laravel Nova may have added assets to the public directory
# or maybe some custom assets were added manually! Either way, we merge
# in the assets we generated above rather than overwrite them
COPY --from=node_modules_go_brrr /app/public /var/www/html/public-npm
RUN rsync -ar /var/www/html/public-npm/ /var/www/html/public/ \
    && rm -rf /var/www/html/public-npm \
    && chown -R www-data:www-data /var/www/html/public

EXPOSE 8080

ENTRYPOINT ["/entrypoint"]
