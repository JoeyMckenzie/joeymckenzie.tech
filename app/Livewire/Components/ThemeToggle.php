<?php

declare(strict_types=1);

namespace App\Livewire\Components;

use Illuminate\View\View;
use Livewire\Attributes\Session;
use Livewire\Component;

use function view;

final class ThemeToggle extends Component
{
    #[Session(key: 'prefersdark')]
    public bool $prefersDark = false;

    public function mount(): void
    {
        $this->dispatch('theme-toggled', $this->prefersDark);
    }

    public function toggleTheme(): void
    {
        $this->prefersDark = ! $this->prefersDark;
        $this->dispatch('theme-toggled', $this->prefersDark);
    }

    public function render(): View
    {
        return view('livewire.components.theme-toggle');
    }
}
