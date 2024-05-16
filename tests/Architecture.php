<?php

declare(strict_types=1);

namespace Tests;

test('All source files are strictly typed')
  ->expect('App\\')
  ->toUseStrictTypes();

test('All tests files are strictly typed')
  ->expect('Tests\\')
  ->toUseStrictTypes();

test('Value objects should be immutable')
  ->expect('App\\ValueObjects\\')
  ->toBeFinal();

test('Contracts should be abstract')
  ->expect('App\\Contracts\\')
  ->toBeInterfaces();
