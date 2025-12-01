<?php

declare(strict_types=1);

namespace App\Livewire\Pages;

use App\Support\Seo\StructuredDataBuilder;
use Illuminate\View\View;
use Livewire\Attributes\Title;
use Livewire\Component;

final class Now extends Component
{
    #[Title('Now.')]
    public function render(): View
    {
        $structuredData = StructuredDataBuilder::new()
            ->context('https://schema.org')
            ->type('AboutPage')
            ->headline('What Joey is doing now')
            ->description('Current projects, learning, and activities that Joey McKenzie is focused on right now.')
            ->author('Joey McKenzie')
            ->mainEntityOfPage(url()->current())
            ->make();

        return view('livewire.pages.now')
            ->layout('components.layout', [
                'title' => 'Now',
                'description' => 'Current projects, learning, and activities that Joey McKenzie is focused on right now.',
                'ogType' => 'website',
                'structuredData' => $structuredData->toArray(),
            ]);
    }
}
