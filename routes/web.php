<?php

declare(strict_types=1);

use App\Http\Controllers\FeedbackController;

Route::post('/feedback', FeedbackController::class)->name('feedback.store');
