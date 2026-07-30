<?php

declare(strict_types=1);

namespace Tests\Feature\Blog;

use App\Models\Post;
use App\Services\PostImporter;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(PostImporter::class)]
final class PostImporterTest extends TestCase
{
    use RefreshDatabase;

    private function imageDisk(): string
    {
        return Config::string('blog.image_disk');
    }

    /**
     * Build a self-contained legacy images root with a cover and an inline image.
     */
    private function fixtureImagesRoot(): string
    {
        $root = sys_get_temp_dir().'/import-fixture-'.bin2hex(random_bytes(6));
        File::ensureDirectoryExists($root.'/sub');

        $cover = UploadedFile::fake()->image('cover.png', 900, 600);
        $inline = UploadedFile::fake()->image('inline.png', 700, 500);
        File::copy((string) $cover->getRealPath(), $root.'/sub/cover.png');
        File::copy((string) $inline->getRealPath(), $root.'/sub/inline.png');

        return $root;
    }

    private function fixtureMarkdown(): string
    {
        return <<<'MD'
            ---
            title: Test Post
            slug: test-post
            description: A representative description
            image: assets/images/sub/cover.png
            tag_id: 8
            published_at: '2024-01-15'
            storage_key: should-be-ignored
            ---

            Intro with a local inline image:

            ![a shot](/assets/blog/sub/inline.png)

            An external image stays put:

            ![meme](https://media.giphy.com/x.gif)

            ```php
            echo 'hi';
            ```
            MD;
    }

    #[Test]
    public function it_imports_front_matter_uploads_images_and_rewrites_references(): void
    {
        Storage::fake($this->imageDisk(), ['url' => 'https://images.test']);
        $root = $this->fixtureImagesRoot();

        $post = app(PostImporter::class)->import($this->fixtureMarkdown(), $root);

        // Front matter parsed; tag created from id; reading time + HTML rendered.
        $this->assertSame('Test Post', $post->title);
        $this->assertSame('A representative description', $post->description);
        $this->assertSame(8, $post->tag_id);
        $this->assertSame('rust', $post->tag->name);
        $this->assertGreaterThan(0, $post->reading_time_minutes);
        $this->assertStringContainsString('class="phiki', $post->content_html ?? '');

        // Cover stored as an object key; inline image stored too.
        $this->assertSame('posts/test-post/cover.webp', $post->image);
        Storage::disk($this->imageDisk())->assertExists('posts/test-post/cover.webp');
        Storage::disk($this->imageDisk())->assertExists('posts/test-post/inline.webp');

        // Inline reference rewritten to the absolute R2 URL; external URL untouched.
        $this->assertStringContainsString('https://images.test/posts/test-post/inline.webp', $post->content);
        $this->assertStringNotContainsString('/assets/blog/sub/inline.png', $post->content);
        $this->assertStringContainsString('https://media.giphy.com/x.gif', $post->content);
    }

    #[Test]
    public function it_upserts_by_slug_without_creating_duplicates(): void
    {
        Storage::fake($this->imageDisk(), ['url' => 'https://images.test']);
        $root = $this->fixtureImagesRoot();
        $importer = app(PostImporter::class);

        $importer->import($this->fixtureMarkdown(), $root);
        $importer->import($this->fixtureMarkdown(), $root);

        $this->assertSame(1, Post::query()->withoutGlobalScopes()->where('slug', 'test-post')->count());
    }

    #[Test]
    public function it_handles_unquoted_yaml_dates_parsed_as_timestamps(): void
    {
        Storage::fake($this->imageDisk(), ['url' => 'https://images.test']);

        // An unquoted YAML date arrives as a Unix timestamp, not a string.
        $markdown = "---\ntitle: Old Post\nslug: old-post\ndescription: d\nimage: assets/images/missing.png\ntag_id: 3\n"
            ."published_at: 2019-10-04\n---\n\nBody copy.";

        $emptyRoot = sys_get_temp_dir().'/import-empty-'.bin2hex(random_bytes(6));
        File::ensureDirectoryExists($emptyRoot);

        $post = app(PostImporter::class)->import($markdown, $emptyRoot);

        $this->assertNotNull($post->published_at);
        $this->assertSame('2019-10-04', $post->published_at->toDateString());
    }
}
