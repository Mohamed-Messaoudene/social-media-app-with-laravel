<?php

namespace App\Models;

use App\Notifications\CustomVerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable implements MustVerifyEmail
{
    use  HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'first_name',
        'last_name',
        'bio',
        'profile_image_path',
        'cover_image_path',
        'location',
        'birth_date',
        'is_active',
        'is_verified',
        'is_private',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'password',
        'remember_token',
        'email_verified_at',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'birth_date' => 'date',
        'is_active' => 'boolean',
        'is_verified' => 'boolean',
        'is_private' => 'boolean',
        'password' => 'hashed',
    ];

    /**
     * The accessors to append to the model's array form.
     */
    protected $appends = [
        'full_name',
        'profile_image_url',
        'cover_image_url',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONSHIPS
    |--------------------------------------------------------------------------
    */

    /**
     * A user has many posts.
     */
    public function posts()
    {
        return $this->hasMany(Post::class)->latest();
    }

    /**
     * A user has many comments.
     */
    public function comments()
    {
        return $this->hasMany(Comment::class)->latest();
    }


    /**
     * A user has many likes (polymorphic).
     */
    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    /**
     * A user has many stories.
     */
    public function stories()
    {
        return $this->hasMany(Story::class)
            ->where('expires_at', '>', now())
            ->latest();
    }

    /**
     * Users who follow this user.
     */
    public function followers()
    {
        return $this->belongsToMany(
            User::class,
            'follows',
            'following_id',
            'follower_id'
        )
            ->withTimestamps()
            ->wherePivot('status', 'accepted');
    }

    /**
     * Users this user is following.
     */
    public function following()
    {
        return $this->belongsToMany(
            User::class,
            'follows',
            'follower_id',
            'following_id'
        )
            ->withTimestamps()
            ->wherePivot('status', 'accepted');
    }

    /**
     * Pending follow requests sent to this user.
     */
    public function pendingFollowers()
    {
        return $this->belongsToMany(
            User::class,
            'follows',
            'following_id',
            'follower_id'
        )
            ->wherePivot('status', 'pending')
            ->withTimestamps();
    }

    /**
     * Users blocked by this user.
     */
    // public function blockedUsers()
    // {
    //     return $this->belongsToMany(
    //         User::class,
    //         'blocks',
    //         'blocker_id',
    //         'blocked_id'
    //     )
    //     ->withTimestamps();
    // }

    /**
     * Users who have blocked this user.
     */
    // public function blockedBy()
    // {
    //     return $this->belongsToMany(
    //         User::class,
    //         'blocks',
    //         'blocked_id',
    //         'blocker_id'
    //     )
    //     ->withTimestamps();
    // }

    /**
     * User's bookmarks.
     */
    // public function bookmarks()
    // {
    //     return $this->hasMany(Bookmark::class);
    // }

    /**
     * Notifications received by this user.
     */
    // public function receivedNotifications()
    // {
    //     return $this->hasMany(Notification::class, 'user_id')->latest();
    // }

    /*
    |--------------------------------------------------------------------------
    | ACCESSORS & MUTATORS
    |--------------------------------------------------------------------------
    */

    /**
     * Get the user's full name.
     */
    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}") ?: $this->username;
    }

    /**
     * Get the user's profile image URL.
     */
    public function getProfileImageUrlAttribute(): ?string
    {
        return $this->profile_image_path
            ? Storage::url($this->profile_image_path)
            : null;
    }

    /**
     * Get the user's cover image URL.
     */
    public function getCoverImageUrlAttribute(): ?string
    {
        return $this->cover_image_path
            ? Storage::url($this->cover_image_path)
            : null;
    }

    /*
    |--------------------------------------------------------------------------
    | SCOPES
    |--------------------------------------------------------------------------
    */

    /**
     * Scope to get only active users.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get only verified users.
     */
    public function scopeVerified($query)
    {
        return $query->whereNotNull('email_verified_at');
    }

    /**
     * Scope to search users by username or name.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('username', 'LIKE', "%{$search}%")
                ->orWhere('first_name', 'LIKE', "%{$search}%")
                ->orWhere('last_name', 'LIKE', "%{$search}%");
        });
    }

    /**
     * Scope to get suggested users (not following, active, has posts).
     */
    public function scopeSuggested($query, User $user)
    {
        return $query->active()
            ->where('id', '!=', $user->id)
            ->whereNotIn('id', $user->following()->pluck('users.id'))
            ->whereNotIn('id', $user->blockedUsers()->pluck('users.id'))
            ->whereNotIn('id', $user->blockedBy()->pluck('users.id'))
            ->has('posts', '>=', 1)
            ->inRandomOrder()
            ->limit(5);
    }

    /*
    |--------------------------------------------------------------------------
    | HELPER METHODS
    |--------------------------------------------------------------------------
    */

    /**
     * Check if this user is following another user.
     */
    public function isFollowing(User $user): bool
    {
        return $this->following()->where('following_id', $user->id)->exists();
    }

    /**
     * Check if this user is followed by another user.
     */
    public function isFollowedBy(User $user): bool
    {
        return $this->followers()->where('follower_id', $user->id)->exists();
    }

    /**
     * Check if this user has blocked another user.
     */
    // public function hasBlocked(User $user): bool
    // {
    //     return $this->blockedUsers()->where('blocked_id', $user->id)->exists();
    // }

    /**
     * Check if this user is blocked by another user.
     */
    // public function isBlockedBy(User $user): bool
    // {
    //     return $this->blockedBy()->where('blocker_id', $user->id)->exists();
    // }

    /**
     * Follow a user.
     */
    public function follow(User $user): void
    {
        if ($this->id === $user->id || $this->isFollowing($user)) {
            return;
        }

        $status = $user->is_private ? 'pending' : 'accepted';

        $this->following()->attach($user->id, [
            'status' => $status,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Unfollow a user.
     */
    public function unfollow(User $user): void
    {
        $this->following()->detach($user->id);
    }

    /**
     * Block a user.
     */
    // public function block(User $user): void
    // {
    //     if ($this->id === $user->id) {
    //         return;
    //     }

    //     // Remove existing follow relationships
    //     $this->following()->detach($user->id);
    //     $this->followers()->detach($user->id);

    //     // Add block
    //     $this->blockedUsers()->attach($user->id, [
    //         'created_at' => now(),
    //         'updated_at' => now(),
    //     ]);
    // }

    /**
     * Unblock a user.
     */
    // public function unblock(User $user): void
    // {
    //     $this->blockedUsers()->detach($user->id);
    // }

    /**
     * Update last login timestamp.
     */
    public function updateLastLogin(): void
    {
        $this->update(['last_login_at' => now()]);
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
        // Auto-delete user's files when user is deleted
        static::deleting(function (User $user) {
            if ($user->profile_image_path) {
                Storage::delete($user->profile_image_path);
            }
            if ($user->cover_image_path) {
                Storage::delete($user->cover_image_path);
            }
        });
    }

    /**
     * Override Laravel's default email verification notification.
     * 
     * This method is called when event(new Registered($user)) fires.
     */
    public function sendEmailVerificationNotification()
    {
        // Instead of Laravel's default VerifyEmail notification,
        // we send our custom one
        $this->notify(new CustomVerifyEmail);
    }
}
