<?php

declare(strict_types=1);

namespace App\Ai\Middleware;

use Closure;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Ai\Prompts\AgentPrompt;
use Laravel\Ai\Responses\AgentResponse;

final class LogBlogPostReview
{
    /**
     * Handle the incoming prompt.
     *
     * @param  Closure(AgentPrompt): AgentResponse  $next
     */
    public function handle(AgentPrompt $prompt, Closure $next): AgentResponse
    {
        $reviewRequestId = (string) Str::uuid7();
        $startedAt = (int) hrtime(true);
        $context = [
            'review_request_id' => $reviewRequestId,
            'provider' => $prompt->provider->name(),
            'model' => $prompt->model,
            'timeout_seconds' => $prompt->timeout,
            'prompt_characters' => Str::length($prompt->prompt),
        ];

        Log::info('Blog post reviewer prompted', $context);

        return $next($prompt)->then(function (AgentResponse $response) use ($context, $startedAt): void {
            Log::info('Blog post reviewer responded', [
                ...$context,
                'invocation_id' => $response->invocationId,
                'duration_ms' => $this->elapsedMilliseconds($startedAt),
                'prompt_tokens' => $response->usage->promptTokens,
                'completion_tokens' => $response->usage->completionTokens,
                'cache_write_input_tokens' => $response->usage->cacheWriteInputTokens,
                'cache_read_input_tokens' => $response->usage->cacheReadInputTokens,
                'reasoning_tokens' => $response->usage->reasoningTokens,
            ]);
        });
    }

    private function elapsedMilliseconds(int $startedAt): int
    {
        return (int) round(((int) hrtime(true) - $startedAt) / 1_000_000);
    }
}
