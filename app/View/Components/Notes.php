<?php

declare(strict_types=1);

namespace App\View\Components;

use App\Models\Note;
use Illuminate\View\Component;
use Illuminate\View\View;
use Override;

final class Notes extends Component
{
    #[Override]
    public function render(): View
    {
        $notes = Note::all();

        return view('components.notes', [
            'notes' => $notes,
        ]);
    }
}
