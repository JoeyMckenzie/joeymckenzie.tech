<?php

declare(strict_types=1);

namespace App\Filament\Resources\FeedbackResource\Pages;

use App\Filament\Resources\FeedbackResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;
use Override;

final class ViewFeedback extends ViewRecord
{
    protected static string $resource = FeedbackResource::class;

    #[Override]
    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }
}
