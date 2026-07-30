<?php

declare(strict_types=1);

namespace Tests\Feature\Blog;

use App\Services\CommonMark\MermaidExtension;
use App\Services\CommonMark\MermaidRenderer;
use App\Services\MarkdownRenderer;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\UsesClass;
use Tests\TestCase;

#[CoversClass(MarkdownRenderer::class)]
#[UsesClass(MermaidExtension::class)]
#[UsesClass(MermaidRenderer::class)]
final class MarkdownRendererTest extends TestCase
{
    #[Test]
    public function it_highlights_code_blocks_with_phiki(): void
    {
        $html = new MarkdownRenderer()->render("```php\necho 'g''day';\n```");

        $this->assertStringContainsString('class="phiki', $html);
        $this->assertStringContainsString('data-language="php"', $html);
        $this->assertStringContainsString('style="color:', $html);
    }

    #[Test]
    public function it_renders_mermaid_fences_as_a_client_side_div(): void
    {
        $html = new MarkdownRenderer()->render("```mermaid\ngraph TD;\nA-->B;\n```");

        $this->assertStringContainsString('<div class="mermaid">', $html);
        $this->assertStringContainsString('graph TD;', $html);
        // A mermaid block is not passed through Phiki highlighting.
        $this->assertStringNotContainsString('phiki', $html);
    }

    #[Test]
    public function it_renders_strikethrough(): void
    {
        $this->assertStringContainsString('<del>gone</del>', new MarkdownRenderer()->render('~~gone~~'));
    }

    #[Test]
    public function identical_markdown_yields_identical_html(): void
    {
        $renderer = new MarkdownRenderer;
        $markdown = "# Title\n\nSome **bold** and `code`.";

        $this->assertSame($renderer->render($markdown), $renderer->render($markdown));
    }
}
