<?php

declare(strict_types=1);

namespace App\View\Components;

use App\ValueObjects\DisplayableIcon;
use Illuminate\View\Component;
use Illuminate\View\View;

final class PoweredBy extends Component
{
    /**
     * @var DisplayableIcon[]
     */
    public array $providers = [];

    public function render(): View
    {
        $this->providers[] = new DisplayableIcon('https://laravel.com', 'Laravel', 'icon-[logos--laravel]');
        $this->providers[] = new DisplayableIcon('https://livewire.laravel.com', 'Livewire', 'icon-[devicon--livewire]');
        $this->providers[] = new DisplayableIcon('https://fly.io', 'Fly.io', 'icon-[logos--fly-icon]');

        return view('components.powered-by');
    }
}
