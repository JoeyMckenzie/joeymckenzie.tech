<?php

declare(strict_types=1);

use App\Http\Controllers\ViewsController;
use Illuminate\Support\Facades\Route;

Route::get('views', ViewsController::class);
