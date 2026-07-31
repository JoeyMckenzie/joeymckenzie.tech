<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Http\Controllers\Admin\PostImageController;
use App\Http\Requests\Admin\PostImageRequest;
use App\Models\User;
use App\Services\ImageProcessor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\UsesClass;
use Tests\TestCase;

#[CoversClass(PostImageController::class)]
#[UsesClass(PostImageRequest::class)]
#[UsesClass(ImageProcessor::class)]
#[UsesClass(User::class)]
final class PostImageUploadTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function guests_are_redirected_to_the_login_page(): void
    {
        $this->fakeImageDisk();

        $this->post(route('admin.posts.images.store'), [
            'image' => UploadedFile::fake()->image('diagram.png'),
        ])->assertRedirect(route('login'));

        $this->assertSame([], Storage::disk($this->imageDisk())->allFiles());
    }

    #[Test]
    public function it_stores_an_upload_and_returns_its_absolute_url(): void
    {
        $this->fakeImageDisk();

        $url = $this->upload(UploadedFile::fake()->image('diagram.png'), 'my-post');

        $this->assertStringStartsWith('https://', $url);
        $this->assertStringEndsWith('.webp', $url);

        Storage::disk($this->imageDisk())->assertExists($this->keyFor($url));
    }

    #[Test]
    public function it_buckets_the_object_under_the_posts_slug(): void
    {
        $this->fakeImageDisk();

        $key = $this->keyFor($this->upload(UploadedFile::fake()->image('diagram.png'), 'my-post'));

        $this->assertStringStartsWith('posts/my-post/', $key);
    }

    /**
     * Images can be dropped into a post that has not been saved yet, so an
     * absent slug buckets under `drafts` rather than erroring.
     */
    #[Test]
    public function it_buckets_the_object_under_drafts_when_no_slug_is_sent(): void
    {
        $this->fakeImageDisk();

        $key = $this->keyFor($this->upload(UploadedFile::fake()->image('diagram.png')));

        $this->assertStringStartsWith('posts/drafts/', $key);
    }

    #[Test]
    public function it_buckets_the_object_under_drafts_when_the_slug_is_blank(): void
    {
        $this->fakeImageDisk();

        $key = $this->keyFor($this->upload(UploadedFile::fake()->image('diagram.png'), '   '));

        $this->assertStringStartsWith('posts/drafts/', $key);
    }

    /**
     * The whole point of the pipeline: whatever was uploaded lands as WebP.
     * Checked against the RIFF/WEBP magic bytes rather than the extension.
     */
    #[Test]
    public function the_stored_object_is_really_webp(): void
    {
        $this->fakeImageDisk();

        $key = $this->keyFor($this->upload(UploadedFile::fake()->image('diagram.png', 800, 600), 'my-post'));
        $bytes = (string) Storage::disk($this->imageDisk())->get($key);

        $this->assertSame('RIFF', mb_substr($bytes, 0, 4, '8bit'));
        $this->assertSame('WEBP', mb_substr($bytes, 8, 4, '8bit'));
    }

    #[Test]
    public function it_rejects_a_non_image_upload(): void
    {
        $this->fakeImageDisk();

        $this->actingAs(User::factory()->create())
            ->post(route('admin.posts.images.store'), [
                'image' => UploadedFile::fake()->create('notes.txt', 16),
            ])
            ->assertSessionHasErrors('image');

        $this->assertSame([], Storage::disk($this->imageDisk())->allFiles());
    }

    #[Test]
    public function it_rejects_an_oversized_image(): void
    {
        $this->fakeImageDisk();

        $this->actingAs(User::factory()->create())
            ->post(route('admin.posts.images.store'), [
                'image' => UploadedFile::fake()->image('huge.jpg')->size(9000),
            ])
            ->assertSessionHasErrors('image');

        $this->assertSame([], Storage::disk($this->imageDisk())->allFiles());
    }

    #[Test]
    public function it_requires_a_file(): void
    {
        $this->fakeImageDisk();

        $this->actingAs(User::factory()->create())
            ->post(route('admin.posts.images.store'), ['slug' => 'my-post'])
            ->assertSessionHasErrors('image');

        $this->assertSame([], Storage::disk($this->imageDisk())->allFiles());
    }

    /**
     * The absolute url the endpoint hands back for an upload.
     */
    private function upload(UploadedFile $image, ?string $slug = null): string
    {
        $payload = ['image' => $image];

        if ($slug !== null) {
            $payload['slug'] = $slug;
        }

        $response = $this->actingAs(User::factory()->create())
            ->post(route('admin.posts.images.store'), $payload);

        $response->assertOk()->assertSessionHasNoErrors();

        $url = $response->json('url');

        $this->assertIsString($url);

        return $url;
    }

    /**
     * The object key behind a returned url, so the disk can be asserted against
     * without the controller having to leak the key it deliberately hides.
     */
    private function keyFor(string $url): string
    {
        $path = parse_url($url, PHP_URL_PATH);

        $this->assertIsString($path);

        return ltrim($path, '/');
    }

    private function fakeImageDisk(): void
    {
        Storage::fake($this->imageDisk(), ['url' => 'https://images.test']);
    }

    private function imageDisk(): string
    {
        return Config::string('blog.image_disk');
    }
}
