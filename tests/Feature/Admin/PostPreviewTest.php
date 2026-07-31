<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Enums\PostStatus;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\PostPreviewController;
use App\Http\Requests\Admin\PostPreviewRequest;
use App\Http\Requests\Admin\PostRequest;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use App\Services\CommonMark\MermaidExtension;
use App\Services\CommonMark\MermaidRenderer;
use App\Services\MarkdownRenderer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\UsesClass;
use Tests\TestCase;

#[CoversClass(PostPreviewController::class)]
#[UsesClass(PostPreviewRequest::class)]
#[UsesClass(MarkdownRenderer::class)]
#[UsesClass(MermaidExtension::class)]
#[UsesClass(MermaidRenderer::class)]
#[UsesClass(PostController::class)]
#[UsesClass(PostRequest::class)]
#[UsesClass(Post::class)]
#[UsesClass(User::class)]
final class PostPreviewTest extends TestCase
{
    use RefreshDatabase;

    private const string CONTENT = "# Heading\n\nSome **bold** text.";

    /**
     * Everything the published page cares about: a heading, emphasis, a Phiki
     * highlighted fence, and a Mermaid fence.
     */
    private const string RICH_CONTENT = <<<'MARKDOWN'
        # Heading

        Some **bold** text.

        ```php
        <?php echo 1;
        ```

        ```mermaid
        graph TD;
        A-->B;
        ```
        MARKDOWN;

    #[Test]
    public function guests_are_redirected_to_the_login_page(): void
    {
        $this->post(route('admin.posts.preview'), ['content' => self::CONTENT])
            ->assertRedirect(route('login'));
    }

    #[Test]
    public function it_returns_rendered_html_for_an_authenticated_request(): void
    {
        $this->actingAs(User::factory()->create())
            ->post(route('admin.posts.preview'), ['content' => self::CONTENT])
            ->assertOk()
            ->assertJsonStructure(['html']);
    }

    #[Test]
    public function it_really_renders_the_markdown(): void
    {
        $html = $this->preview(self::CONTENT);

        $this->assertStringContainsString('<h1', $html);
        $this->assertStringContainsString('<strong>', $html);
    }

    /**
     * Phiki emits a `<pre class="phiki language-php tokyo-night" ...>` wrapper
     * with inline theme colours; the class and the data-language attribute are
     * the stable markers.
     */
    #[Test]
    public function it_returns_a_phiki_highlighted_code_fence(): void
    {
        $html = $this->preview("```php\n<?php echo 1;\n```");

        $this->assertStringContainsString('<pre', $html);
        $this->assertStringContainsString('class="phiki language-php tokyo-night"', $html);
        $this->assertStringContainsString('data-language="php"', $html);
        $this->assertStringContainsString('style="background-color:', $html);
    }

    /**
     * The client-side Mermaid step keys off this exact wrapper, so the preview
     * has to hand back the raw, unescaped diagram source rather than
     * highlighted (or entity-encoded) tokens.
     */
    #[Test]
    public function it_returns_a_mermaid_fence_as_a_client_rendered_div(): void
    {
        $html = $this->preview("```mermaid\ngraph TD;\nA-->B;\n```");

        $this->assertStringContainsString('<div class="mermaid">', $html);
        $this->assertStringContainsString('graph TD;', $html);
        $this->assertStringContainsString('A-->B;', $html);
        $this->assertStringNotContainsString('class="phiki', $html);
    }

    /**
     * The rule is `present`, not `required`: an emptied editor previews as
     * empty instead of erroring.
     */
    #[Test]
    public function it_accepts_empty_content(): void
    {
        $response = $this->actingAs(User::factory()->create())
            ->post(route('admin.posts.preview'), ['content' => '']);

        $response->assertOk();

        $html = $response->json('html');

        $this->assertIsString($html);
        $this->assertSame('', mb_trim($html));
    }

    #[Test]
    public function it_rejects_a_missing_content_key(): void
    {
        $this->actingAs(User::factory()->create())
            ->post(route('admin.posts.preview'), [])
            ->assertSessionHasErrors('content');
    }

    /**
     * The executable form of docs/adr/0004: the preview pane is not an
     * approximation. The same markdown through the preview endpoint and
     * through publishing has to come back byte-for-byte identical.
     */
    #[Test]
    public function the_preview_html_is_identical_to_the_published_html(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('admin.posts.store'), [
                'title' => 'Writing Zig In Anger',
                'slug' => 'writing-zig-in-anger',
                'description' => 'A short note about comptime.',
                'tag_id' => Tag::factory()->create()->id,
                'content' => self::RICH_CONTENT,
                'status' => PostStatus::Draft->value,
            ])
            ->assertSessionHasNoErrors();

        $published = Post::query()->withoutGlobalScopes()->latest('id')->firstOrFail()->content_html;

        $this->assertNotNull($published);
        $this->assertSame($published, $this->preview(self::RICH_CONTENT));
    }

    /**
     * The html the preview endpoint hands back for some markdown.
     */
    private function preview(string $content): string
    {
        $response = $this->actingAs(User::factory()->create())
            ->post(route('admin.posts.preview'), ['content' => $content]);

        $response->assertOk();

        $html = $response->json('html');

        $this->assertIsString($html);

        return $html;
    }
}
