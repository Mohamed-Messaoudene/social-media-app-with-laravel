<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth; 

class CommentController extends Controller
{
    // Store a new comment
    public function store(Request $request, $postId)
    {
        $request->validate([
            'comment_text' => 'required|string|max:500',
        ]);


        $comment = Comment::create([
            'user_id' => Auth::id(),
            'post_id' => $postId,
            'comment_text' => $request->comment_text,
        ]);

        return redirect()->route('posts.index');
    }
}
