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
        Schema::create('follows', function (Blueprint $table) {
            $table->id();
            $table->foreignId('follower_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('following_id')->constrained('users')->onDelete('cascade');

            // status of the follow relationship 
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->boolean('notifications_enabled')->default(true);
            
            // prevent duplicate follow relationships
            $table->unique(['follower_id', 'following_id']);

            // timestamps
            $table->timestamps();

            // indexes
            $table->index('follower_id');
            $table->index('following_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('follows');
    }
};
