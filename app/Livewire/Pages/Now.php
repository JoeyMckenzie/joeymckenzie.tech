<?php

declare(strict_types=1);

namespace App\Livewire\Pages;

use Illuminate\View\View;
use Livewire\Component;

final class Now extends Component
{
    public function render(): View
    {
        return view('livewire.pages.now');
    }
}
