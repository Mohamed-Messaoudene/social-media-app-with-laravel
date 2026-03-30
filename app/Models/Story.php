<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Story extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'image_path',
        'video_path',
        'caption',
        'type',
        'views_count',
        'expires_at',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'expires_at' => 'datetime',
        'views_count' => 'integer',
    ];

    /**
     * The accessors to append to the model's array form.
     */
    protected $appends = [
        'media_url',
        'is_expired',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONSHIPS
    |--------------------------------------------------------------------------
    */

    /**
     * A story belongs to a user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /*
    |--------------------------------------------------------------------------
    | ACCESSORS
    |--------------------------------------------------------------------------
    */

    /**
     * Get the story's media URL.
     */
    public function getMediaUrlAttribute(): ?string
    {
        $path = $this->type === 'video' ? $this->video_path : $this->image_path;
        return $path ? Storage::url($path) : null;
    }

    /**
     * Check if story is expired.
     */
    public function getIsExpiredAttribute(): bool
    {
        return $this->expires_at->isPast();
    }

    /*
    |--------------------------------------------------------------------------
    | SCOPES
    |--------------------------------------------------------------------------
    */

    /**
     * Scope to get active (non-expired) stories.
     */
    public function scopeActive($query)
    {
        return $query->where('expires_at', '>', now());
    }

    /**
     * Scope to get expired stories.
     */
    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<=', now());
    }

    /*
    |--------------------------------------------------------------------------
    | HELPER METHODS
    |--------------------------------------------------------------------------
    */

    /**
     * Increment views count.
     */
    public function incrementViews(): void
    {
        $this->increment('views_count');
    }

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
        // ✅ AUTO-SET expiration time (24 hours from creation)
        static::creating(function (Story $story) {
            if (!$story->expires_at) {
                $story->expires_at = now()->addHours(24);
            }
        });

        // Delete associated files when story is deleted
        static::deleting(function (Story $story) {
            if ($story->image_path) {
                Storage::delete($story->image_path);
            }
            if ($story->video_path) {
                Storage::delete($story->video_path);
            }
        });
    }
}