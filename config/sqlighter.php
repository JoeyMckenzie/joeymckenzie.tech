<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | SQLighter Backup Status
    |--------------------------------------------------------------------------
    |
    | This option determines whether automated SQLite database backups are
    | enabled for your application. When enabled, SQLighter will create
    | backup copies of your database at the configured frequency.
    |
    */

    'enabled' => env('SQLIGTHER_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Backup Frequency Interval
    |--------------------------------------------------------------------------
    |
    | Here you may specify a custom cron interval between each automatic backup
    | of your SQLite database. This value determines how often SQLighter
    | creates a new backup copy of your application's database file.
    |
    */

    'frequency' => env('SQLIGTHER_FREQUENCY', ''),

    /*
    |--------------------------------------------------------------------------
    | SQLite Database Filename
    |--------------------------------------------------------------------------
    |
    | This configuration option allows you to specify the filename of your
    | SQLite database that should be backed up. The path is relative to
    | your database directory and defaults to 'database.sqlite'.
    |
    */

    'database_filename' => env('SQLIGTHER_DATABASE_FILENAME', 'database.sqlite'),

    /*
    |--------------------------------------------------------------------------
    | Maximum Backup Copy Retention
    |--------------------------------------------------------------------------
    |
    | This value determines the maximum number of backup copies that will be
    | retained by SQLighter. Once this limit is reached, older backups are
    | automatically removed when new backup copies are created.
    |
    */

    'copies_to_maintain' => env('SQLIGTHER_COPIES', 5),

    /*
    |--------------------------------------------------------------------------
    | Backup Storage Location
    |--------------------------------------------------------------------------
    |
    | Here you may specify the directory where your database backups will be
    | stored. This path is relative to your Laravel database directory and
    | defaults to a 'backups' folder within that directory structure.
    |
    */

    'storage_folder' => env('SQLIGTHER_STORAGE', 'backups/'),

    /*
    |--------------------------------------------------------------------------
    | Backup File Prefix
    |--------------------------------------------------------------------------
    |
    | This configuration value sets the prefix used when naming backup files.
    | For example, using 'backup' will create files like 'backup-{timestamp}.sql'.
    | You can customize this to help identify different backup sets.
    |
    */

    'file_prefix' => env('SQLIGTHER_PREFIX', 'backup'),

];
