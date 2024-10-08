<?php

declare(strict_types=1);

namespace App\Filament\Resources;

use App\Filament\Resources\FeedbackResource\Pages;
use App\Filament\Resources\FeedbackResource\Widgets\FeedbackStatsOverview;
use App\Models\Feedback;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Override;

final class FeedbackResource extends Resource
{
    protected static ?string $model = Feedback::class;

    protected static ?string $navigationIcon = 'fas-comment';

    protected static ?string $navigationGroup = 'Settings';

    #[Override]
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Textarea::make('message')
                    ->maxLength(65535)
                    ->columnSpan('full'),
                TextInput::make('ip_address')
                    ->maxLength(512),
                TextInput::make('user_agent')
                    ->maxLength(512),
            ]);
    }

    #[Override]
    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('text'),
                TextColumn::make('ip_address'),
                TextColumn::make('user_agent'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    #[Override]
    public static function getWidgets(): array
    {
        return [
            FeedbackStatsOverview::class,
        ];
    }

    #[Override]
    public static function getPages(): array
    {
        return [
            'index' => Pages\ListFeedback::route('/'),
            'view' => Pages\ViewFeedback::route('/{record}'),
        ];
    }
}
