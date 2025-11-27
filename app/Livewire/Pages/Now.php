<?php

declare(strict_types=1);

namespace App\Livewire\Pages;

use Illuminate\View\View;
use Livewire\Attributes\Title;
use Livewire\Component;

final class Now extends Component
{
    #[Title('Now.')]
    public function render(): View
    {
        return view('livewire.pages.now');
    }
}
