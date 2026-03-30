<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'likeable_id',
        'likeable_type',
    ];

    /**
     * Disable updated_at (we only need created_at).
     */
    const UPDATED_AT = null;

    /*
    |--------------------------------------------------------------------------
    | RELATIONSHIPS
    |--------------------------------------------------------------------------
    */

    /**
     * A like belongs to a user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the parent likeable model (post, comment, etc.).
     */
    public function likeable()
    {
        return $this->morphTo();
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
        // ✅ AUTO-INCREMENT likes count when like is created
        static::created(function (Like $like) {
            if (method_exists($like->likeable, 'incrementLikesCount')) {
                $like->likeable->incrementLikesCount();
            }
        });

        // ✅ AUTO-DECREMENT likes count when like is deleted
        static::deleted(function (Like $like) {
            if ($like->likeable && method_exists($like->likeable, 'decrementLikesCount')) {
                $like->likeable->decrementLikesCount();
            }
        });
    }
}