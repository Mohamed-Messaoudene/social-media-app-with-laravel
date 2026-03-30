<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comment extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'post_id',
        'parent_id',
        'content',
        'likes_count',
        'replies_count',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'likes_count' => 'integer',
        'replies_count' => 'integer',
    ];

    /**
     * The accessors to append to the model's array form.
     */
    protected $appends = [
        'is_liked_by_auth',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONSHIPS
    |--------------------------------------------------------------------------
    */

    /**
     * A comment belongs to a user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * A comment belongs to a post.
     */
    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    /**
     * A comment can have a parent comment (for replies).
     */
    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    /**
     * A comment can have many replies.
     */
    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id')->latest();
    }

    /**
     * A comment has many likes (polymorphic).
     */
    public function likes()
    {
        return $this->morphMany(Like::class, 'likeable');
    }

    /*
    |--------------------------------------------------------------------------
    | ACCESSORS
    |--------------------------------------------------------------------------
    */

    /**
     * Check if authenticated user liked this comment.
     */
    public function getIsLikedByAuthAttribute(): bool
    {
        if (!auth()->check()) {
            return false;
        }

        return $this->likes()
            ->where('user_id', auth()->id())
            ->exists();
    }

    /*
    |--------------------------------------------------------------------------
    | SCOPES
    |--------------------------------------------------------------------------
    */

    /**
     * Scope to get only top-level comments (not replies).
     */
    public function scopeTopLevel($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Scope to get with user and replies.
     */
    public function scopeWithRelations($query)
    {
        return $query->with(['user', 'replies.user', 'replies.likes']);
    }

    /*
    |--------------------------------------------------------------------------
    | HELPER METHODS
    |--------------------------------------------------------------------------
    */

    /**
     * Increment likes count.
     */
    public function incrementLikesCount(): void
    {
        $this->increment('likes_count');
    }

    /**
     * Decrement likes count.
     */
    public function decrementLikesCount(): void
    {
        $this->decrement('likes_count');
    }

    /**
     * Increment replies count.
     */
    public function incrementRepliesCount(): void
    {
        $this->increment('replies_count');
    }

    /**
     * Decrement replies count.
     */
    public function decrementRepliesCount(): void
    {
        $this->decrement('replies_count');
    }

    /**
     * Mark comment as edited.
     */
    // public function markAsEdited(): void
    // {
    //     $this->update(['is_edited' => true]);
    // }

    /*
    |--------------------------------------------------------------------------
    | EVENTS
    |--------------------------------------------------------------------------
    */

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        // ✅ AUTO-INCREMENT post's comment count when comment is created
        static::created(function (Comment $comment) {
            $comment->post->incrementCommentsCount();
            
            // If it's a reply, increment parent comment's replies count
            if ($comment->parent_id) {
                $comment->parent->incrementRepliesCount();
            }
        });

        // ✅ AUTO-DECREMENT post's comment count when comment is deleted
        static::deleted(function (Comment $comment) {
            $comment->post->decrementCommentsCount();
            
            // If it's a reply, decrement parent comment's replies count
            if ($comment->parent_id && $comment->parent) {
                $comment->parent->decrementRepliesCount();
            }
        });
    }
}