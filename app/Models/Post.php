<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    // Fields that can be mass-assigned
    protected $fillable = [
        'user_id',
        'postText',
        'postImagePath',
    ];
    // Relationship: A post belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }
     // Define the relationship with the Like model
     public function likes()
     {
         return $this->hasMany(Like::class);
     }
     // Define the relationship with the Like model
     public function comments()
     {
         return $this->hasMany(Comment::class);
     }
}
