<?php

declare(strict_types=1);

namespace App\Filament\Resources\NoteResource\Pages;

use App\Filament\Resources\NoteResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Override;

final class ListNotes extends ListRecords
{
    protected static string $resource = NoteResource::class;

    #[Override]
    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
