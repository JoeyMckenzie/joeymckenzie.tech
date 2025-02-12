@props([
    'title',
    'subtitle',
])

<header>
    <nav>
        <a href="{{ route('home') }}" class="{{ request()->routeIs('home') ? 'current' : null }}">Home</a>
        <a href="{{ route('now') }}" class="{{ request()->routeIs('now') ? 'current' : null }}">Now</a>
        <a href="{{ route('blog') }}" class="{{ request()->routeIs('blog') ? 'current' : null }}">Blog</a>
        <h1>{{ $title }}</h1>
        <p>{{ $subtitle }}</p>
    </nav>
</header>
