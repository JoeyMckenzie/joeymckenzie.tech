<?php

declare(strict_types=1);

namespace App\Livewire\Components;

use App\ValueObjects\NavigationItem;
use Illuminate\View\View;
use Livewire\Component;

use function view;

final class Navbar extends Component
{
    private const string ACTIVE_CLASS = 'text-lime-600 font-semibold dark:text-lime-400';

    private const string INACTIVE_CLASS = 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200';

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

    public function getClassnameForLink(string $route, ?string $subRoute = null): string
    {
        $containsRoute = $subRoute !== null
            ? request()->routeIs($route)
            : request()->routeIs($route) || request()->routeIs($subRoute);

        return $containsRoute
            ? self::ACTIVE_CLASS
            : self::INACTIVE_CLASS;
    }
}
