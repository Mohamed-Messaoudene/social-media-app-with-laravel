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
        Schema::create('stories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->string('image_path')->nullable();
            $table->string('video_path')->nullable();
            $table->string('caption')->nullable();

            // story specific features
            $table->enum('visibility', ['public', 'friends', 'private'])->default('friends');
            $table->enum('type', ['image', 'video'])->default('image');
            $table->dateTime('expires_at');
            $table->unsignedInteger('views_count')->default(0);


            $table->timestamps();

            // indexes
            $table->index('user_id');
            $table->index('expires_at');
            $table->index(['user_id', 'expires_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stories');
    }
};
