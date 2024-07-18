#!/usr/bin/env bash

DB_FOLDER=/var/www/html/storage/database
APP_FOLDER=/var/www/html/storage/app

if [ ! -d "$APP_FOLDER" ]; then
    echo "$APP_FOLDER is not a directory, copying storage_ content to storage"
    cp -r /var/www/html/storage_/. /var/www/html/storage
    echo "deleting storage_..."
    rm -rf /var/www/html/storage_
fi

if [ ! -d "$DB_FOLDER" ]; then
    echo "$DB_FOLDER is not a directory, initializing database"
    mkdir /var/www/html/storage/database
    touch /var/www/html/storage/database/database.sqlite
fi
