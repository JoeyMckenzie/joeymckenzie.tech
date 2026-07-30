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
    #[\Override]
    public function render(Node $node, ChildNodeRendererInterface $childRenderer): ?HtmlElement
    {
        if (! $node instanceof FencedCode) {
            return null;
        }

        if ($node->getInfo() !== 'mermaid') {
            return null;
        }

        return new HtmlElement('div', ['class' => 'mermaid'], $node->getLiteral());
    }
}
