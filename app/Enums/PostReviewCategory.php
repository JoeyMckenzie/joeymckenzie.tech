<?php

declare(strict_types=1);

namespace App\Enums;

enum PostReviewCategory: string
{
    case Clarity = 'Clarity';

    case Conciseness = 'Conciseness';

    case Flow = 'Flow';

    case Tone = 'Tone';
}
