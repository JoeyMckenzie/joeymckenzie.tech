<?php

declare(strict_types=1);

namespace App\Support\Seo;

final class StructuredDataBuilder
{
    private StructuredData $internal;

    public static function new(): self
    {
        return new self();
    }

    public function headline(string $headline): self
    {
        $this->internal = $this->internal->clone([
            'headline' => $headline,
        ]);

        return $this;
    }

    public function description(string $description): self
    {
        $this->internal = $this->internal->clone([
            'description' => $description,
        ]);

        return $this;
    }

    public function make(): StructuredData
    {
        return $this->internal;
    }
}
