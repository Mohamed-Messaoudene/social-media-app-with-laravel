<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id', // Foreign key to the users table
        'post_id', // Foreign key to the posts table
        'comment_text', // The comment content
    ];
    /**
     * Relationship: A comment belongs to a user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship: A comment belongs to a post.
     */
    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
