<?php

declare(strict_types=1);

use App\Models\Note;
use Illuminate\View\View;

use function Laravel\Folio\render;

render(function (View $view) {
    $notes = Note::select(['description', 'created_at'])
        ->orderByDesc('created_at')
        ->get();

    return $view->with('notes', $notes);
}); ?>

@section('title')
    Notes.
@endsection

<x-app-layout>
    <div class="hero">
        <div class="hero-content">
            <div class="prose max-w-md">
                <h1 class="text-center text-xl font-bold">Notes.</h1>
                <p>
                    My digital brain dump, where half-baked ideas come to marinate in their own mediocrity.
                    Proceed at your own risk of eye-rolling and unsolicited enlightenment.
                </p>
                <div class="grid grid-cols-1 gap-6">
                    @foreach ($notes as $note)
                        <div class="alert" role="alert">
                            <x-bi-code class="hidden sm:block" />
                            <span>{{ $note->description }}</span>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
