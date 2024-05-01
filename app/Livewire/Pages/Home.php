<?php

declare(strict_types=1);

namespace App\Livewire\Pages;

use Illuminate\View\View;
use Livewire\Attributes\Layout;
use Livewire\Attributes\Title;
use Livewire\Component;

#[Title("Hey, I'm Joey.")]
#[Layout('layouts.app')]
final class Home extends Component
{
    public function render(): View
    {
        return view('livewire.pages.index');
    }
}
