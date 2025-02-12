@props([
    'quote' => null,
])

@if ($quote !== null)
    <blockquote>
        <p>{{ $quote->quote }}</p>
        <p><cite>– {{ $quote->author }}</cite></p>
    </blockquote>
@endif
