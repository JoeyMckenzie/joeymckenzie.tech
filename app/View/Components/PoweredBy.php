<?php

declare(strict_types=1);

namespace App\View\Components;

use App\ValueObjects\DisplayableIcon;
use Illuminate\Support\Facades\Config;
use Illuminate\View\Component;
use Illuminate\View\View;
use Override;

final class PoweredBy extends Component
{
    public string $commit;

    public string $commitLink;

    /**
     * @var DisplayableIcon[]
     */
    public array $providers = [];

    public function __construct()
    {
        $commit = Config::string('site.commit');
        $this->commit = substr($commit, 0, 6);
        $this->commitLink = "https://github.com/JoeyMckenzie/joeymckenzie.tech/tree/$commit";
    }

    #[Override]
    public function render(): View
    {
        $this->providers[] = new DisplayableIcon('https://laravel.com', 'Laravel', 'fab-laravel');
        $this->providers[] = new DisplayableIcon('https://digitalocean.com', 'Digital Ocean', 'fab-digital-ocean');

        return view('components.powered-by');
    }
}
