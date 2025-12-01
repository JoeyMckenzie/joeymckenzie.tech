<?php

declare(strict_types=1);

namespace Tests\Queries;

use App\Models\Post;
use App\Queries\AllPostsQuery;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Orbit\Facades\Orbit;
use PHPUnit\Framework\Assert;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

#[CoversClass(AllPostsQuery::class)]
final class AllPostsQueryTest extends TestCase
{
    private string $orbitContentPath;

    protected function setUp(): void
    {
        parent::setUp();

        $this->orbitContentPath = storage_path('framework/testing/orbit/'.Str::uuid());
        File::ensureDirectoryExists($this->orbitContentPath.'/posts');

        Config::set('orbit.paths.content', $this->orbitContentPath);
        Orbit::test();

        $schema = Post::resolveConnection()->getSchemaBuilder();
        $schema->dropIfExists('posts');
        $schema->create('posts', static function (Blueprint $table): void {
            $table->string('storage_key')->primary();
            $table->string('slug');
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('content')->nullable();
            $table->string('image')->nullable();
            $table->date('published_at')->nullable();
            $table->unsignedInteger('tag_id')->default(1);
        });
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->orbitContentPath);

        App::detectEnvironment(static fn () => 'testing');
        Cache::flush();

        parent::tearDown();
    }

    #[Test]
    public function unpublished_posts_are_included_locally_and_sorted_first(): void
    {
        Post::query()->delete();

        $this->createPost('draft-post', null);
        $this->createPost('published-old', '2020-01-01');
        $this->createPost('published-new', '2024-01-01');

        $posts = app(AllPostsQuery::class)->execute();

        Assert::assertSame(['draft-post', 'published-new', 'published-old'], $posts->pluck('slug')->all());
    }

    #[Test]
    public function production_filters_unpublished_posts(): void
    {
        App::detectEnvironment(static fn () => 'production');
        Assert::assertTrue(app()->isProduction());

        Post::query()->delete();

        $this->createPost('draft-post', null);
        $this->createPost('published-old', '2020-01-01');
        $this->createPost('published-new', '2024-01-01');

        Assert::assertSame(2, Post::query()->published()->count());

        $builder = Post::query() // @phpstan-ignore argument.templateType
            ->with('tag:id,name')
            ->when(app()->isProduction(), fn (Builder $query) => $query->published())
            ->latestPublished();

        Assert::assertSame(['published-new', 'published-old'], $builder->pluck('slug')->all());

        $posts = app(AllPostsQuery::class)->execute();

        Assert::assertSame(['published-new', 'published-old'], $posts->pluck('slug')->all());
        Assert::assertTrue($posts->every(fn (Post $post): bool => $post->published_at !== null));
    }

    private function createPost(string $slug, ?string $publishedAt): void
    {
        Post::unguarded(function () use ($slug, $publishedAt): void {
            Post::query()->create([
                'storage_key' => $slug,
                'slug' => $slug,
                'title' => ucfirst(str_replace('-', ' ', $slug)),
                'description' => 'Description',
                'content' => 'Content',
                'image' => 'image.jpg',
                'tag_id' => 1,
                'published_at' => $publishedAt,
            ]);
        });
    }
}
