<nav class="flex flex-row justify-center gap-x-4 py-12 text-sm">
    @foreach ($links as $link)
        <a class="{{ $link->getActiveClass() }}" href="{{ $link->href }}">{{ $link->text }}</a>
    @endforeach
</nav>
