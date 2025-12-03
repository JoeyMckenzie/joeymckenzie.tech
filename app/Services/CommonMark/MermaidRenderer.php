<?php

declare(strict_types=1);

namespace App\Services\CommonMark;

use League\CommonMark\Extension\CommonMark\Node\Block\FencedCode;
use League\CommonMark\Node\Node;
use League\CommonMark\Renderer\ChildNodeRendererInterface;
use League\CommonMark\Renderer\NodeRendererInterface;
use League\CommonMark\Util\HtmlElement;

final class MermaidRenderer implements NodeRendererInterface
{
    public function render(Node $node, ChildNodeRendererInterface $childRenderer): ?HtmlElement
    {
        if (! $node instanceof FencedCode) {
            return null;
        }

        $infoString = $node->getInfo();

        if ($infoString !== 'mermaid') {
            return null;
        }

        $content = $node->getLiteral();

        return new HtmlElement('div', ['class' => 'mermaid'], $content);
    }
}
