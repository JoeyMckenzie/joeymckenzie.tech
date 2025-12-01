<?php

declare(strict_types=1);

namespace App\Support\Seo;

final class StructuredDataBuilder
{
    private StructuredData $internal;

    private function __construct()
    {
        $this->internal = new StructuredData();
    }

    public static function new(): self
    {
        return new self();
    }

    public function context(string $context): self
    {
        $this->internal = clone ($this->internal, [
            'context' => $context,
        ]);

        return $this;
    }

    public function type(string $type): self
    {
        $this->internal = clone ($this->internal, [
            'type' => $type,
        ]);

        return $this;
    }

    public function headline(string $headline): self
    {
        $this->internal = clone ($this->internal, [
            'headline' => $headline,
        ]);

        return $this;
    }

    public function description(string $description): self
    {
        $this->internal = clone ($this->internal, [
            'description' => $description,
        ]);

        return $this;
    }

    public function image(string $image): self
    {
        $this->internal = clone ($this->internal, [
            'image' => $image,
        ]);

        return $this;
    }

    public function author(string $name): self
    {
        $this->internal = clone ($this->internal, [
            'author' => [
                '@type' => 'Person',
                'name' => $name,
            ],
        ]);

        return $this;
    }

    public function publisher(string $name): self
    {
        $this->internal = clone ($this->internal, [
            'publisher' => [
                '@type' => 'Organization',
                'name' => $name,
            ],
        ]);

        return $this;
    }

    public function datePublished(?string $date): self
    {
        $this->internal = clone ($this->internal, [
            'datePublished' => $date,
        ]);

        return $this;
    }

    public function dateModified(?string $date): self
    {
        $this->internal = clone ($this->internal, [
            'dateModified' => $date,
        ]);

        return $this;
    }

    public function mainEntityOfPage(string $id): self
    {
        $this->internal = clone ($this->internal, [
            'mainEntityOfPage' => [
                '@type' => 'WebPage',
                '@id' => $id,
            ],
        ]);

        return $this;
    }

    public function make(): StructuredData
    {
        return clone $this->internal;
    }
}
