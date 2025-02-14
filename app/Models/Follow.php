<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Follow extends Model
{
    use HasFactory;
    protected $fillable = [
        'follower_id', // Foreign key to the users table (the user who is following)
        'following_id', // Foreign key to the users table (the user being followed)
    ];

    /**
     * Relationship: A follow record belongs to the follower (user).
     */
    public function follower()
    {
        return $this->belongsTo(User::class, 'follower_id');
    }

    /**
     * Relationship: A follow record belongs to the following (user).
     */
    public function following()
    {
        return $this->belongsTo(User::class, 'following_id');
    }
}
