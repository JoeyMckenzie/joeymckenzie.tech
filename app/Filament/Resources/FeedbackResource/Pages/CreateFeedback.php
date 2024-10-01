<?php

declare(strict_types=1);

namespace App\Filament\Resources\FeedbackResource\Pages;

use App\Filament\Resources\FeedbackResource;
use Filament\Resources\Pages\CreateRecord;

final class CreateFeedback extends CreateRecord
{
    protected static string $resource = FeedbackResource::class;
}
