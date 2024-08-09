<?php

declare(strict_types=1);

namespace App\Livewire\Components;

use App\ValueObjects\NavigationItem;
use Illuminate\Support\Str;
use Illuminate\View\View;
use Livewire\Component;

use function view;

final class Navbar extends Component
{
    private const string ACTIVE_CLASS = 'text-lime-600 font-semibold dark:text-lime-400';

    private const string INACTIVE_CLASS = 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200';

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

    public function getClassnameForLink(string $route): string
    {
        return Str::contains(request()->route()?->getName() ?? '', $route)
            ? self::ACTIVE_CLASS
            : self::INACTIVE_CLASS;
    }
}
