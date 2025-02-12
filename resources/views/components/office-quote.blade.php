@props([
    'quote'
])

<blockquote>
    <p>{{ $quote->quote }}</p>
    <p><cite>– {{ $quote->author }}</cite></p>
</blockquote>
