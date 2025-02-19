@props(['title', 'subtitle', 'extra' => null])

<header>
    <nav>
        <a data-pan="nav-home" href="{{ route('home') }}"
            class="{{ request()->routeIs('home') ? 'current' : null }}">Home</a>
        <a data-pan="nav-now" href="{{ route('now') }}" class="{{ request()->routeIs('now') ? 'current' : null }}">Now</a>
        <a data-pan="nav-blog" href="{{ route('blog.index') }}"
            class="{{ request()->routeIs('blog.index') || request()->routeIs('blog.show') ? 'current' : null }}">Blog</a>
        <h3 style="max-width: 40ch; margin-left: auto; margin-right: auto; text-align: center">{{ $title }}</h3>
        <p>{{ $subtitle }}</p>
        @if ($extra !== null)
            <p>{{ $extra }}</p>
        @endif
    </nav>
</header>
