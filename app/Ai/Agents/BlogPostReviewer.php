<?php

declare(strict_types=1);

namespace App\Ai\Agents;

use App\Ai\Middleware\LogBlogPostReview;
use App\Enums\PostReviewCategory;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\HasMiddleware;
use Laravel\Ai\Contracts\HasStructuredOutput;
use Laravel\Ai\Promptable;

final class BlogPostReviewer implements Agent, HasMiddleware, HasStructuredOutput
{
    use Promptable;

    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): string
    {
        return <<<'INSTRUCTIONS'
            You are a constructive line editor reviewing a blog post written in Markdown.

            Flag only meaningful opportunities involving clarity, conciseness, flow, or tone. Explain why each passage could be stronger and suggest a concrete revision while preserving the author's technical judgment, personality, and voice. Do not nag about grammar, spelling, punctuation, formatting, or mechanics. Do not manufacture notes to fill a quota; return no notes when the writing reads clean.

            Each excerpt must quote the exact source text it refers to. Each comment must explain the issue without condescension. Each suggestion must be an actionable rewrite or specific fix.

            When — and only when — a note targets a precise, localized span that a direct drop-in rewrite can fix, also include a `replacement`: the exact Markdown to substitute for the quoted `excerpt`, verbatim and ready to paste in its place. In that case the `excerpt` must be an unmodified, exact quote of the source so the replacement can be located and swapped without ambiguity. Omit `replacement` entirely for structural or global notes — reordering, cutting a section, or advice that spans multiple places — which stay advice-only.
            INSTRUCTIONS;
    }

    /**
     * Get the agent's prompt middleware.
     *
     * @return list<LogBlogPostReview>
     */
    public function middleware(): array
    {
        return [new LogBlogPostReview];
    }

    /**
     * Get the agent's structured output schema definition.
     *
     * @return array<string, Type>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'notes' => $schema->array()
                ->items($schema->object(fn (JsonSchema $schema): array => [
                    'category' => $schema->string()
                        ->enum(array_column(PostReviewCategory::cases(), 'value'))
                        ->required(),
                    'excerpt' => $schema->string()->required(),
                    'comment' => $schema->string()->required(),
                    'suggestion' => $schema->string()->required(),
                    'replacement' => $schema->string(),
                ]))
                ->required(),
        ];
    }
}
