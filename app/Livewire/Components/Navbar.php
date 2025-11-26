<?php

declare(strict_types=1);

namespace App\Livewire\Components;

use Illuminate\View\View;
use Livewire\Component;

/**
 * @phpstan-type NavbarItemSchema array{
 *     label: string,
 *     href: string,
 *     active: bool
 * }
 */
final class Navbar extends Component
{
    /**
     * @var NavbarItemSchema[]
     */
    public array $navLinks;

    public function mount(): void
    {
        $this->navLinks = [
            [
                'label' => 'home',
                'href' => route('home'),
                'active' => request()->routeIs('home'),
            ],
            [
                'label' => 'now',
                'href' => route('now'),
                'active' => request()->routeIs('now'),
            ],
            [
                'label' => 'blog',
                'href' => route('blog.index'),
                'active' => request()->routeIs('blog.*') || request()->is('blog/*'),
            ],
        ];
    }

    public function render(): View
    {
        return view('livewire.components.navbar');
    }
}
