<?php

declare(strict_types=1);

namespace App\Enums;

enum PostReviewStatus: string
{
    case Pending = 'pending';

    case Completed = 'completed';

    case Failed = 'failed';

    case Superseded = 'superseded';
}
