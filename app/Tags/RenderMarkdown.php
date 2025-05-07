<?php

declare(strict_types=1);

namespace App\Tags;

use Illuminate\Support\Facades\Cache;
use Statamic\Facades\Markdown;
use Statamic\Tags\Tags;

final class RenderMarkdown extends Tags
{
    public function index(): mixed
    {
        $content = $this->params->get('content');

        if ($content === null) {
            return '';
        }

        $cacheKey = 'rendered_markdown_'.md5($content);

        return Cache::rememberForever($cacheKey, fn () => Markdown::parser('shiki')->parse($content));
    }
}
