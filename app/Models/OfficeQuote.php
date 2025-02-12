<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $quote
 * @property string $author
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OfficeQuote newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OfficeQuote newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OfficeQuote query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OfficeQuote whereAuthor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OfficeQuote whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OfficeQuote whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OfficeQuote whereQuote($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OfficeQuote whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
final class OfficeQuote extends Model
{
    //
}
