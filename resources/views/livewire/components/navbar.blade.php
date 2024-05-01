<div class="mx-auto flex flex-row justify-center gap-x-4 pt-8">
    <div class="breadcrumbs text-sm">
        <ul>
            @foreach ($navigationItems as $item)
                <li wire:key="{{ $item->display }}">
                    <a href="{{ $item->href }}" wire:navigate>
                        {{ $item->display }}
                    </a>
                </li>
            @endforeach
        </ul>
    </div>
</div>
