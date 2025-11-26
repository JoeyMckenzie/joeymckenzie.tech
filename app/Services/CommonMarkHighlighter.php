<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use League\CommonMark\Environment\Environment;
use League\CommonMark\Exception\CommonMarkException;
use League\CommonMark\Extension\CommonMark\CommonMarkCoreExtension;
use League\CommonMark\MarkdownConverter;
use Phiki\Adapters\CommonMark\PhikiExtension;
use Phiki\Theme\Theme;

final class CommonMarkHighlighter
{
    /**
     * @throws CommonMarkException
     */
    public function highlight(string $slug, string $content): string
    {
        /** @var string $parsedContent */
        $parsedContent = app()->isProduction()
            ? Cache::rememberForever($slug, fn () => $this->highlightContent($content))
            : $this->highlightContent($content);

        return $parsedContent;
    }

    /**
     * @throws CommonMarkException
     */
    private function highlightContent(string $content): string
    {
        $environment = new Environment()
            ->addExtension(new CommonMarkCoreExtension)
            ->addExtension(new PhikiExtension(Theme::OneDarkPro));

        $converter = new MarkdownConverter($environment);

        return $converter->convert($content)->getContent();
    }
}
