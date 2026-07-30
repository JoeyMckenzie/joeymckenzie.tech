<?php

declare(strict_types=1);

namespace App\Services\CommonMark;

use League\CommonMark\Environment\EnvironmentBuilderInterface;
use League\CommonMark\Extension\CommonMark\Node\Block\FencedCode;
use League\CommonMark\Extension\ExtensionInterface;

final class MermaidExtension implements ExtensionInterface
{
    /**
     * Render ```mermaid fenced blocks as <div class="mermaid"> for client-side
     * drawing. Higher priority than Phiki's fenced-code renderer; non-mermaid
     * fences return null and fall through to Phiki highlighting.
     */
    #[\Override]
    public function register(EnvironmentBuilderInterface $environment): void
    {
        $environment->addRenderer(FencedCode::class, new MermaidRenderer, priority: 100);
    }
}
