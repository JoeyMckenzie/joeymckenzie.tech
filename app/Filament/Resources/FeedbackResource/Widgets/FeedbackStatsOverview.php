<?php

declare(strict_types=1);

namespace App\Filament\Resources\FeedbackResource\Widgets;

use App\Models\Feedback;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

final class FeedbackStatsOverview extends BaseWidget
{
    #[\Override]
    protected function getStats(): array
    {
        return [
            Stat::make('Feedback Submitted', Feedback::count())
                ->descriptionIcon('heroicon-m-arrow-trending-up'),
        ];
    }
}
