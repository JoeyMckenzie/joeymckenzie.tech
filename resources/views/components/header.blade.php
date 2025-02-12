@props([
    'title',
    'subtitle',
])

<header>
    <nav>
        <a href="{{ route('home') }}" class="{{ request()->routeIs('home') ? 'current' : null }}">Home</a>
        <a href="{{ route('now') }}" class="{{ request()->routeIs('now') ? 'current' : null }}">Now</a>
        <a href="{{ route('blog.index') }}"
           class="{{ request()->routeIs('blog.index') || request()->routeIs('blog.show') ? 'current' : null }}">Blog</a>
        <h2>{{ $title }}</h2>
        <p>{{ $subtitle }}</p>
    </nav>
</header>
