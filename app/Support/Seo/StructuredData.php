<?php

declare(strict_types=1);

namespace App\Support\Seo;

use App\Concerns\ArraySchemeable;
use ArrayAccess;
use Illuminate\Contracts\Support\Arrayable;
use LogicException;

/**
 * @phpstan-type MetadataSchema array{"@type": string, name: string}
 * @phpstan-type EntitySchema array{"@type": string, "@id": string}
 * @phpstan-type StructuredDataSchema array{
 *     context: string,
 *     type: string,
 *     headline: string,
 *     image: string,
 *     author: MetadataSchema,
 *     publisher: MetadataSchema,
 *     datePublished?: string,
 *     dateModified?: string,
 *     mainEntity: EntitySchema
 * }
 *
 * @implements ArrayAccess<key-of<StructuredDataSchema>, mixed>
 * @implements Arrayable<key-of<StructuredDataSchema>, mixed>
 * @implements ArraySchemeable<StructuredDataSchema>
 */
final class StructuredData implements Arrayable, ArrayAccess
{
    public string $context;

    public string $type;

    public string $headline;

    public string $description;

    public string $image;

    /**
     * @var MetadataSchema
     */
    public array $author;

    /**
     * @var MetadataSchema
     */
    public array $publisher;

    public ?string $datePublished;

    public ?string $dateModified;

    /**
     * @var EntitySchema
     */
    public array $mainEntity;

    public function offsetExists(mixed $offset): bool
    {
        return array_key_exists($offset, $this->toArray());
    }

    /**
     * @return StructuredDataSchema
     */
    public function toArray(): array
    {
        return [
            'context' => $this->context,
            'type' => $this->type,
            'headline' => $this->headline,
            'description' => $this->description,
            'image' => $this->image,
            'author' => $this->author,
            'publisher' => $this->publisher,
            'datePublished' => $this->datePublished,
            'dateModified' => $this->dateModified,
            'mainEntity' => $this->mainEntity,
        ];
    }

    public function offsetGet(mixed $offset): mixed
    {
        return $this->toArray()[$offset];
    }

    public function offsetSet(mixed $offset, mixed $value): void
    {
        throw new LogicException('Cannot modify readonly array property.');
    }

    public function offsetUnset(mixed $offset): void
    {
        throw new LogicException('Cannot modify readonly array property.');
    }
}
