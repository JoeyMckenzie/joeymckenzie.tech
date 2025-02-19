<?php

declare(strict_types=1);

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $quote
 * @property string $author
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @method static Builder<static>|OfficeQuote newModelQuery()
 * @method static Builder<static>|OfficeQuote newQuery()
 * @method static Builder<static>|OfficeQuote query()
 * @method static Builder<static>|OfficeQuote whereAuthor($value)
 * @method static Builder<static>|OfficeQuote whereCreatedAt($value)
 * @method static Builder<static>|OfficeQuote whereId($value)
 * @method static Builder<static>|OfficeQuote whereQuote($value)
 * @method static Builder<static>|OfficeQuote whereUpdatedAt($value)
 *
 * @mixin Eloquent
 * @mixin IdeHelperOfficeQuote
 */
final class OfficeQuote extends Model
{
    //
}
