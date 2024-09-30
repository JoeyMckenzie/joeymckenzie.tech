<?php

declare(strict_types=1);

namespace App\Filament\Resources\NoteResource\Pages;

use App\Filament\Resources\NoteResource;
use Filament\Resources\Pages\CreateRecord;

final class CreateNote extends CreateRecord
{
    protected static string $resource = NoteResource::class;
}
