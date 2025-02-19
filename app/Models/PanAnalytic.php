<?php

declare(strict_types=1);

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property int $impressions
 * @property int $hovers
 * @property int $clicks
 *
 * @method static Builder<static>|PanAnalytic newModelQuery()
 * @method static Builder<static>|PanAnalytic newQuery()
 * @method static Builder<static>|PanAnalytic query()
 * @method static Builder<static>|PanAnalytic whereClicks($value)
 * @method static Builder<static>|PanAnalytic whereHovers($value)
 * @method static Builder<static>|PanAnalytic whereId($value)
 * @method static Builder<static>|PanAnalytic whereImpressions($value)
 * @method static Builder<static>|PanAnalytic whereName($value)
 *
 * @mixin Eloquent
 * @mixin IdeHelperPanAnalytic
 */
final class PanAnalytic extends Model
{
    //
}
