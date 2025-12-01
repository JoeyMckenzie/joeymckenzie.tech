<?php

declare(strict_types=1);

namespace App\Support\Seo;

use App\Concerns\ArraySchemeable;
use ArrayAccess;
use Illuminate\Contracts\Support\Arrayable;
use InvalidArgumentException;
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
final readonly class StructuredData implements Arrayable, ArrayAccess, ArraySchemeable
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

    /**
     * @param  MetadataSchema  $author
     * @param  MetadataSchema  $publisher
     * @param  EntitySchema  $mainEntity
     */
    public function __construct(
        string $context,
        string $type,
        string $headline,
        string $description,
        string $image,
        array $author,
        array $publisher,
        ?string $datePublished,
        ?string $dateModified,
        array $mainEntity
    ) {
        $this->context = $context;
        $this->type = $type;
        $this->headline = $headline;
        $this->description = $description;
        $this->image = $image;
        $this->author = $author;
        $this->publisher = $publisher;
        $this->datePublished = $datePublished;
        $this->dateModified = $dateModified;
        $this->mainEntity = $mainEntity;
    }

    /**
     * @param  array<key-of<StructuredDataSchema>, value-of<StructuredDataSchema>>  $properties
     */
    public function clone(array $properties = []): self
    {
        foreach ($properties as $key => $_) {
            if (! in_array($key, $this->schema(), true)) {
                throw new InvalidArgumentException("Property $key is not allowed.");
            }
        }

        return new self(
            context: $properties['context'] ?? $this->context,
            type: $properties['type'] ?? $this->type,
            headline: $properties['headline'] ?? $this->headline,
            description: $properties['description'] ?? $this->description,
            image: $properties['image'] ?? $this->image,
            author: $properties['author'] ?? $this->author,
            publisher: $properties['publisher'] ?? $this->publisher,
            datePublished: $properties['datePublished'] ?? $this->datePublished,
            dateModified: $properties['dateModified'] ?? $this->dateModified,
            mainEntity: $properties['mainEntity'] ?? $this->mainEntity,
        );
    }

    public function schema(): array
    {
        return [
            'context',
            'type',
            'headline',
            'description',
            'image',
            'author',
            'publisher',
            'datePublished',
            'dateModified',
            'mainEntity',
        ];
    }

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
