<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Http\Request;
use App\Models\Like;

class LikeController extends Controller
{
    // Like a post
    public function like($postId)
    {
        Like::firstOrCreate([
            'user_id' => Auth::id(),
            'post_id' => $postId,
        ]);

        return redirect()->route('posts.index');
    }

    // Unlike a post
    public function unlike($postId)
    {
        Like::where('user_id', Auth::id())
            ->where('post_id', $postId)
            ->delete();

        return redirect()->route('posts.index');
    }
}