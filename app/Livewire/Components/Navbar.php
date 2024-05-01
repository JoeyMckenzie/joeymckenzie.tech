<?php

declare(strict_types=1);

namespace App\Livewire\Components;

use App\ValueObjects\NavigationItem;
use Illuminate\View\View;
use Livewire\Component;

use function view;

final class Navbar extends Component
{
    /**
     * @var NavigationItem[]
     */
    public array $navigationItems = [];

    public function mount(): void
    {
        $this->navigationItems[] = new NavigationItem('Home', '/');
        $this->navigationItems[] = new NavigationItem('Now', '/now');
        $this->navigationItems[] = new NavigationItem('Blog', '/blog');
    }

    public function render(): View
    {
        return view('livewire.components.navbar');
    }
}
