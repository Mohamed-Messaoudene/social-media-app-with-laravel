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
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // post content
            $table->text('content');
            $table->string('image_path')->nullable();

            // post settings
            $table->enum('visibility', ['public', 'friends', 'private'])->default('public');
            $table->boolean('is_published')->default(true);
            $table->boolean('comments_enabled')->default(true);


            // counters (for performance optimization)
            $table->unsignedInteger('likes_count')->default(0);
            $table->unsignedInteger('comments_count')->default(0);
            $table->unsignedInteger('shares_count')->default(0);

            // timestamps
            $table->timestamp('published_at')->nullable();
            $table->softDeletes();
            $table->timestamps();

            // indexes
            $table->index('user_id');
            $table->index('published_at');
            $table->index(['user_id', 'published_at']);
            $table->index("is_published");
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
