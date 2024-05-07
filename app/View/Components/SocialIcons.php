<?php

declare(strict_types=1);

namespace App\View\Components;

use App\ValueObjects\DisplayableIcon;
use Illuminate\View\Component;
use Illuminate\View\View;
use Override;

final class SocialIcons extends Component
{
    /**
     * @var DisplayableIcon[]
     */
    public array $socialIcons = [];

    #[Override]
    public function render(): View
    {
        $this->socialIcons[] = new DisplayableIcon('https://linkedin.com/in/joeymckenzie', 'LinkedIn', 'icon-[mdi--linkedin]');
        $this->socialIcons[] = new DisplayableIcon('https://github.com/joeymckenzie', 'GitHub', 'icon-[mdi--github]');
        $this->socialIcons[] = new DisplayableIcon('https://x.com/_joeyMcKenzie', 'Twitter', 'icon-[mdi--twitter]');

        return view('components.social-icons');
    }
}
