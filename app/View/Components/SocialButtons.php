<?php

declare(strict_types=1);

namespace App\View\Components;

use App\ValueObjects\DisplayableIcon;
use Illuminate\View\Component;
use Illuminate\View\View;

final class SocialButtons extends Component
{
    /**
     * @var DisplayableIcon[]
     */
    public array $socialButtons = [];

    public function render(): View
    {
        $this->socialButtons[] = new DisplayableIcon('https://github.com/joeymckenzie', 'GitHub', 'icon-[simple-icons--github]');
        $this->socialButtons[] = new DisplayableIcon('https://linkedin.com/in/joeymckenzie', 'LinkedIn', 'icon-[mdi--linkedin]');
        $this->socialButtons[] = new DisplayableIcon('https://twitter.com/_joeyMcKenzie', 'Twitter', 'icon-[pajamas--twitter]');

        return view('components.social-buttons');
    }
}
