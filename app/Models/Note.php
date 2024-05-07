<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Sushi\Sushi;

final class Note extends Model
{
    use Sushi;

    /**
     * @var array{title: string, description: string}[]
     */
    protected array $rows = [
        [
            'title' => 'Salesforce',
            'description' => 'Empowering atrocity driven development since 1999.',
        ],
        [
            'title' => 'Microliths',
            'description' => 'The inevitable enshittification of microservices...',
        ],
        [
            'title' => 'Networking',
            'description' => 'I have no clue how SSL works.',
        ],
    ];
}
