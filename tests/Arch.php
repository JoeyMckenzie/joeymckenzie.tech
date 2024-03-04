<?php

declare(strict_types=1);

namespace Tests;

test('All source files are strictly typed')
    ->expect('App\\')
    ->toUseStrictTypes();

test('All tests files are strictly typed')
    ->expect('Tests\\')
    ->toUseStrictTypes();

test('All enums should be string backed')
    ->expect('App\\Enums\\')
    ->toBeStringBackedEnums();
