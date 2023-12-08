#!/usr/bin/env bash

/usr/bin/php /var/www/html/artisan app:sync-content
/usr/bin/php /var/www/html/artisan app:generate-sitemap
