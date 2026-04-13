<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Post extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'content',
        'image_path',
        'visibility',
        'is_published',
        'comments_enabled',
        'published_at',
        'likes_count',      // Denormalized counter
        'comments_count',   // Denormalized counter
        'shares_count',     // Denormalized counter
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'is_published' => 'boolean',
        'comments_enabled' => 'boolean',
        'published_at' => 'datetime',
        'likes_count' => 'integer',
        'comments_count' => 'integer',
        'shares_count' => 'integer',
    ];

    /**
     * The accessors to append to the model's array form.
     */
    protected $appends = [
        'image_url',
        // 'is_bookmarked_by_auth',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONSHIPS
    |--------------------------------------------------------------------------
    */

    /**
     * A post belongs to a user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * A post has many comments.
     */
    public function comments()
    {
        return $this->hasMany(Comment::class)->whereNull('parent_id')->latest();
    }

    /**
     * All comments (including replies).
     */
    public function allComments()
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * A post has many likes (polymorphic).
     */
    public function likes()
    {
        return $this->morphMany(Like::class, 'likeable');
    }

    /**
     * A post has many bookmarks (polymorphic).
     */
    // public function bookmarks()
    // {
    //     return $this->morphMany(Bookmark::class, 'bookmarkable');
    // }

    /**
     * Hashtags associated with this post.
     */
    // public function hashtags()
    // {
    //     return $this->morphToMany(Hashtag::class, 'hashtaggable');
    // }

    /*
    |--------------------------------------------------------------------------
    | ACCESSORS
    |--------------------------------------------------------------------------
    */

    /**
     * Get the post's image URL.
     */
    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? Storage::url($this->image_path) : null;
    }

    /**
     * Check if authenticated user bookmarked this post.
     */
    // public function getIsBookmarkedByAuthAttribute(): bool
    // {
    //     if (!auth()->check()) {
    //         return false;
    //     }

    //     return $this->bookmarks()
    //         ->where('user_id', auth()->id())
    //         ->exists();
    // }

    /*
    |--------------------------------------------------------------------------
    | SCOPES
    |--------------------------------------------------------------------------
    */

    /**
     * Scope to get only published posts.
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true)
            ->where(function($q) {
                $q->whereNull('published_at')
                  ->orWhere('published_at', '<=', now());
            });
    }

    /**
     * Scope to get posts visible to a user.
     */
    public function scopeVisibleTo($query, ?User $user = null)
    {
        if (!$user) {
            return $query->where('visibility', 'public');
        }

        return $query->where(function($q) use ($user) {
            $q->where('visibility', 'public')
              ->orWhere('user_id', $user->id)
              ->orWhere(function($subQ) use ($user) {
                  $subQ->where('visibility', 'followers')
                       ->whereHas('user.followers', function($followerQ) use ($user) {
                           $followerQ->where('follower_id', $user->id);
                       });
              });
        });
    }

    /**
     * Scope to get feed posts for a user.
     */
    public function scopeFeed($query, User $user)
    {
        $followingIds = $user->following()->pluck('users.id')->toArray();
        $followingIds[] = $user->id; // Include own posts

        return $query->published()
            ->whereIn('user_id', $followingIds)
            ->visibleTo($user)
            ->with(['user', 'comments.user', 'likes'])
            ->latest();
    }

    /**
     * Scope to get trending posts.
     */
    public function scopeTrending($query, $days = 7)
    {
        return $query->published()
            ->where('created_at', '>=', now()->subDays($days))
            ->where(function($q) {
                $q->where('likes_count', '>', 10)
                  ->orWhere('comments_count', '>', 5);
            })
            ->orderByDesc('likes_count')
            ->orderByDesc('comments_count');
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
     * Increment comments count.
     */
    public function incrementCommentsCount(): void
    {
        $this->increment('comments_count');
    }

    /**
     * Decrement comments count.
     */
    public function decrementCommentsCount(): void
    {
        $this->decrement('comments_count');
    }

    /**
     * Extract and attach hashtags from content.
     */
    // public function syncHashtags(): void
    // {
    //     preg_match_all('/#(\w+)/', $this->content, $matches);
    //     $hashtags = $matches[1] ?? [];

    //     $hashtagIds = [];
    //     foreach ($hashtags as $hashtagName) {
    //         $hashtag = Hashtag::firstOrCreate(
    //             ['slug' => str($hashtagName)->slug()],
    //             ['name' => $hashtagName]
    //         );
    //         $hashtagIds[] = $hashtag->id;
    //     }

    //     $this->hashtags()->sync($hashtagIds);
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
        // Auto-extract hashtags when post is created or updated
        // static::saved(function (Post $post) {
        //     $post->syncHashtags();
        // });

        // Delete associated files when post is deleted
        static::deleted(function (Post $post) {
            if ($post->image_path) {
                Storage::delete($post->image_path);
            }
        });
    }
}