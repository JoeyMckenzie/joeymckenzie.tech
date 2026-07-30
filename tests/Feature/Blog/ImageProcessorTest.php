<?php

declare(strict_types=1);

namespace Tests\Feature\Blog;

use App\Services\ImageProcessor;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Image;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(ImageProcessor::class)]
final class ImageProcessorTest extends TestCase
{
    private function imageDisk(): string
    {
        return Config::string('blog.image_disk');
    }

    #[Test]
    public function it_stores_an_uploaded_image_as_a_capped_webp_object(): void
    {
        Storage::fake($this->imageDisk(), ['url' => 'https://images.test']);

        $result = new ImageProcessor()->store(
            UploadedFile::fake()->image('cover.jpg', 2400, 1400),
            'my-post',
            'cover',
        );

        $this->assertSame('posts/my-post/cover.webp', $result['key']);
        $this->assertStringContainsString('posts/my-post/cover.webp', $result['url']);
        Storage::disk($this->imageDisk())->assertExists('posts/my-post/cover.webp');

        $stored = Image::fromBytes((string) Storage::disk($this->imageDisk())->get($result['key']));
        $this->assertSame('image/webp', $stored->mimeType());
        $this->assertLessThanOrEqual(1600, $stored->width());
    }

    #[Test]
    public function it_normalizes_any_format_to_webp(): void
    {
        Storage::fake($this->imageDisk(), ['url' => 'https://images.test']);

        $result = new ImageProcessor()->store(UploadedFile::fake()->image('shot.png', 800, 600), 'post');

        $stored = Image::fromBytes((string) Storage::disk($this->imageDisk())->get($result['key']));
        $this->assertSame('image/webp', $stored->mimeType());
    }

    #[Test]
    public function it_does_not_upscale_a_small_image(): void
    {
        Storage::fake($this->imageDisk(), ['url' => 'https://images.test']);

        $result = new ImageProcessor()->store(UploadedFile::fake()->image('small.jpg', 400, 300), 'post', 'small');

        $stored = Image::fromBytes((string) Storage::disk($this->imageDisk())->get($result['key']));
        $this->assertSame(400, $stored->width());
    }

    #[Test]
    public function it_accepts_raw_bytes_and_a_local_path(): void
    {
        Storage::fake($this->imageDisk(), ['url' => 'https://images.test']);
        $processor = new ImageProcessor;

        // Hold references so the fake uploads' temp files outlive the read.
        $byteFile = UploadedFile::fake()->image('b.png', 500, 500);
        $bytes = (string) file_get_contents((string) $byteFile->getRealPath());
        $fromBytes = $processor->store($bytes, 'post', 'from-bytes');
        Storage::disk($this->imageDisk())->assertExists($fromBytes['key']);

        $pathFile = UploadedFile::fake()->image('p.jpg', 500, 500);
        $fromPath = $processor->store((string) $pathFile->getRealPath(), 'post', 'from-path');
        Storage::disk($this->imageDisk())->assertExists($fromPath['key']);
    }
}
