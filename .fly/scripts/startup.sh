#!/usr/bin/env bash

/usr/bin/php /var/www/html/artisan app:check-for-content-sync
/usr/bin/php /var/www/html/artisan app:generate-sitemap
