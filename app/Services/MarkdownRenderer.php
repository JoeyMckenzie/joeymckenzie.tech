<?php

declare(strict_types=1);

namespace App\Services;

use App\Services\CommonMark\MermaidExtension;
use League\CommonMark\Environment\Environment;
use League\CommonMark\Exception\CommonMarkException;
use League\CommonMark\Extension\CommonMark\CommonMarkCoreExtension;
use League\CommonMark\Extension\Strikethrough\StrikethroughExtension;
use League\CommonMark\MarkdownConverter;
use Phiki\Adapters\CommonMark\PhikiExtension;
use Phiki\Theme\Theme;

final class MarkdownRenderer
{
    /**
     * @throws CommonMarkException
     */
    public function render(string $markdown): string
    {
        $environment = new Environment;
        $environment->addExtension(new CommonMarkCoreExtension);
        $environment->addExtension(new PhikiExtension(Theme::TokyoNight));
        $environment->addExtension(new MermaidExtension);
        $environment->addExtension(new StrikethroughExtension);

        return new MarkdownConverter($environment)->convert($markdown)->getContent();
    }
}
