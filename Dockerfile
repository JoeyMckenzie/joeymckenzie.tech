# syntax = docker/dockerfile:experimental

# Default to PHP 8.3, but we attempt to match
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

# We'll set these environment variables during the build step, both locally and in our Fly instance
ARG DB_CONNECTION=""
ARG DB_HOST=""
ARG DB_PORT=""
ARG DB_DATABASE=""
ARG DB_USERNAME=""
ARG DB_PASSWORD=""

# create a .env file for loading variables
RUN echo "\n\
    DB_CONNECTION=${DB_CONNECTION}\n\
    DB_HOST=${DB_HOST}\n\
    DB_PORT=${DB_PORT}\n\
    DB_DATABASE=${DB_DATABASE}\n\
    DB_USERNAME=${DB_USERNAME}\n\
    DB_PASSWORD=${DB_PASSWORD}" > ./.env

RUN composer install --optimize-autoloader --no-dev \
    && mkdir -p storage/logs \
    && php artisan optimize:clear \
    && chown -R www-data:www-data /var/www/html \
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

RUN npm ci --no-audit; \
    npm run build;

# From our base container created above, we
# create our final image, adding in static
# assets that we generated above
FROM base

COPY --from=node_modules_go_brrr /usr/local/bin/node /usr/local/bin/node
COPY --from=node_modules_go_brrr /app/node_modules /var/www/html/node_modules
COPY --from=node_modules_go_brrr /app/bootstrap/ssr /var/www/html/bootstrap/ssr

# Packages like Laravel Nova may have added assets to the public directory
# or maybe some custom assets were added manually! Either way, we merge
# in the assets we generated above rather than overwrite them
COPY --from=node_modules_go_brrr /app/public /var/www/html/public-npm
RUN rsync -ar /var/www/html/public-npm/ /var/www/html/public/ \
    && rm -rf /var/www/html/public-npm \
    && chown -R www-data:www-data /var/www/html/public

EXPOSE 8080

ENTRYPOINT ["/entrypoint"]
