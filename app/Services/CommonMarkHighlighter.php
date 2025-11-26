<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use League\CommonMark\Environment\Environment;
use League\CommonMark\Extension\CommonMark\CommonMarkCoreExtension;
use League\CommonMark\MarkdownConverter;
use Phiki\Adapters\CommonMark\PhikiExtension;
use Phiki\Theme\Theme;

final class CommonMarkHighlighter
{
    public function highlight(string $slug, string $content): string
    {
        /** @var string $parsedContent */
        $parsedContent = Cache::rememberForever($slug, function () use ($content) {
            $environment = new Environment()
                ->addExtension(new CommonMarkCoreExtension)
                ->addExtension(new PhikiExtension(Theme::OneDarkPro));

            $converter = new MarkdownConverter($environment);

            return $converter->convert($content)->getContent();
        });

        return $parsedContent;
    }
}
