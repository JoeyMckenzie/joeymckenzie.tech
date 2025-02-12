<?php

declare(strict_types=1);

use App\Models\Keyword;
use App\Models\Post;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('keyword_post', function (Blueprint $table): void {
            $table->id();
            $table->foreignIdFor(Post::class);
            $table->foreignIdFor(Keyword::class);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('keyword_post');
    }
};
