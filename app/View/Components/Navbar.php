<?php

declare(strict_types=1);

namespace App\View\Components;

use App\ValueObjects\NavigationItem;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;
use Override;

final class Navbar extends Component
{
    /** @var NavigationItem[] */
    public array $links;

    public function __construct()
    {
        $this->links = [
            new NavigationItem('Home', '/'),
            new NavigationItem('Now', '/now'),
            new NavigationItem('Blog', '/blog'),
            new NavigationItem('Notes', '/notes'),
        ];
    }

    #[Override]
    public function render(): View
    {
        return view('components.navbar');
    }
}
