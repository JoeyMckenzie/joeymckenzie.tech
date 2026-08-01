<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\PostStatus;
use App\Models\Post;
use App\Models\Tag;
use Carbon\CarbonInterface;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

/**
 * Validates both creating and updating a post; the route's bound post, when there
 * is one, is what makes the slug uniqueness check ignore itself on update.
 */
final class PostRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('posts', 'slug')->ignore($this->boundPost()),
            ],
            'description' => ['required', 'string', 'max:1000'],
            'tag_id' => [
                'nullable',
                'required_without:tag_name',
                'integer',
                Rule::exists(Tag::class, 'id'),
            ],
            'tag_name' => [
                'nullable',
                'required_without:tag_id',
                'string',
                'max:255',
            ],
            'content' => ['required', 'string'],
            'status' => ['required', Rule::enum(PostStatus::class)],
            'published_at' => [
                'exclude_unless:status,'.PostStatus::Scheduled->value,
                'required',
                'date',
                'after:now',
            ],
            'cover' => ['nullable', 'image', 'max:8192'],
        ];
    }

    /**
     * The post being updated, or null when creating.
     *
     * Named to avoid colliding with `Request::post()`.
     */
    public function boundPost(): ?Post
    {
        $post = $this->route('post');

        return $post instanceof Post ? $post : null;
    }

    /**
     * The requested publication state.
     *
     * Validation guarantees a valid case; the unreachable fallback is Draft so a
     * malformed request can never publish something by accident.
     */
    public function status(): PostStatus
    {
        return $this->enum('status', PostStatus::class) ?? PostStatus::Draft;
    }

    /**
     * The requested go-live, for scheduled saves only.
     */
    public function scheduledFor(): ?CarbonInterface
    {
        if ($this->status() !== PostStatus::Scheduled) {
            return null;
        }

        return $this->date('published_at');
    }

    /**
     * Normalise the payload before validation.
     *
     * Slugs are derived from the title unless one was typed, and are normalised
     * either way so the uniqueness check runs against what actually gets stored.
     * New tag names use the same URL-safe representation as seeded tags. A
     * browser submits every field as a string, so a legacy `tag_id` is cast here
     * rather than in the controller — that keeps real form posts and test
     * payloads indistinguishable by the time anything reads validated data.
     */
    #[\Override]
    protected function prepareForValidation(): void
    {
        $title = $this->string('title')->trim()->toString();
        $slug = $this->string('slug')->trim()->toString();

        $this->merge([
            'title' => $title,
            'slug' => Str::slug(blank($slug) ? $title : $slug),
        ]);

        $tagId = $this->input('tag_id');

        if (is_numeric($tagId)) {
            $this->merge(['tag_id' => (int) $tagId]);
        }

        if ($this->exists('tag_name')) {
            $this->merge([
                'tag_name' => Str::slug($this->string('tag_name')->trim()->toString()),
            ]);
        }
    }
}
