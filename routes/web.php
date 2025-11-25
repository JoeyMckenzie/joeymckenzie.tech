<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

Route::get('/', fn (): Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View => view('welcome'))->name('home');
