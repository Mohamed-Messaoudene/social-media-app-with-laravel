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
        Schema::create('likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // polymorphic relationship fields
            $table->morphs('likeable');
            // Creates:
            // - likeable_id (unsignedBigInteger)
            // - likeable_type (string, max 255 chars)
            // - index on ['likeable_id', 'likeable_type']

            $table->timestamps();

            // unique constraint to prevent duplicate likes by the same user on the same likeable entity
            $table->unique(['user_id', 'likeable_id', 'likeable_type']);

            // indexes
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('likes');
    }
};
