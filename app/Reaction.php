<?php

declare(strict_types=1);

namespace App;

enum Reaction: string
{
    case Fire = 'fire';

    case ThumbsUp = 'thumbs_up';

    case MindBlown = 'mind_blown';

    case Heart = 'heart';
}
