<?php

declare(strict_types=1);

namespace App\Filament\Resources\FeedbackResource\Pages;

use App\Filament\Resources\FeedbackResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Override;

final class ListFeedback extends ListRecords
{
    protected static string $resource = FeedbackResource::class;

    #[Override]
    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    #[Override]
    protected function getHeaderWidgets(): array
    {
        return [
            FeedbackResource\Widgets\FeedbackStatsOverview::class,
        ];
    }
}
