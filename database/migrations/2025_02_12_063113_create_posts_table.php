<?php

declare(strict_types=1);

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
        Schema::create('posts', function (Blueprint $table): void {
            $table->id();
            $table->timestamps();
            $table->string('title');
            $table->string('description');
            $table->string('slug')->unique();
            $table->date('published_date');
            $table->string('hero_image');
            $table->string('category');
            $table->text('raw_content');
            $table->longText('parsed_content');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
