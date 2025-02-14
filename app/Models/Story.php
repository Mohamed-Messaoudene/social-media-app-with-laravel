<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Story extends Model
{
    use HasFactory;
    // Fields that can be mass-assigned
    protected $fillable = [
        'user_id',
        'storyImagePath',
    ];
     // Relationship: A story belongs to a user
     public function user()
     {
         return $this->belongsTo(User::class);
     }
}
