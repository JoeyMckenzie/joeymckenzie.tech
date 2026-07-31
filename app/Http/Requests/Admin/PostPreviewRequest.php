<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

final class PostPreviewRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * `present` rather than `required` so an emptied editor previews as empty
     * instead of erroring.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'content' => ['present', 'string'],
        ];
    }

    /**
     * Put an emptied editor back to a string.
     *
     * The global `ConvertEmptyStringsToNull` middleware rewrites `content: ""`
     * to null before validation runs, which would fail the `string` rule and
     * 422 the exact case `present` exists to allow. The `exists()` check keeps a
     * genuinely absent key absent, so `present` can still fail — `input()` alone
     * returns null for both "sent as empty" and "not sent at all".
     */
    #[\Override]
    protected function prepareForValidation(): void
    {
        if ($this->exists('content') && $this->input('content') === null) {
            $this->merge(['content' => '']);
        }
    }
}
