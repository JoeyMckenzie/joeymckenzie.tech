<?php

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
        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('title');
            $table->string('description');
            $table->string('slug')->unique();
            $table->date('published_date')->default(now());
            $table->string('hero_image');
            $table->string('category');
            $table->string('keywords');
            $table->integer('views')->default(0);
            $table->text('raw_content');
            $table->text('parsed_content');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blog_posts');
    }
};
