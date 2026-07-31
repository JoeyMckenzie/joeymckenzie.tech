<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\ValidationException;

final class PostImageRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * The slug is optional because images can be dropped into a post that has
     * not been saved yet; the controller buckets those under `drafts`.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'image' => ['required', 'image', 'max:8192'],
            'slug' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * The uploaded image.
     *
     * Named to avoid colliding with `Request::file()` semantics, and typed so
     * callers do not have to re-narrow what validation already guaranteed. A
     * payload that still is not a single file is a validation failure like any
     * other, so it surfaces as a 422 the editor already knows how to show.
     *
     * @throws ValidationException
     */
    public function uploadedImage(): UploadedFile
    {
        $image = $this->file('image');

        if ($image instanceof UploadedFile) {
            return $image;
        }

        throw ValidationException::withMessages([
            'image' => __('The image must be a single uploaded file.'),
        ]);
    }

    /**
     * The object-key prefix to store under: the post's slug, or `drafts` when
     * the post has no slug yet.
     */
    public function storagePrefix(): string
    {
        $slug = $this->string('slug')->trim()->toString();

        return blank($slug) ? 'drafts' : $slug;
    }
}
