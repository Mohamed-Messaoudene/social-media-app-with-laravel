<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\Post;
use App\Models\User;
use Carbon\Carbon;

class PostController extends Controller
{
    // Show all posts
    public function index()
    {
        $loggedInUserId = Auth::id();

        // Fetch posts with user info, likes, and comments
        $posts = Post::with(['user:id,username,profileImagePath'])
            ->withCount('likes')
            ->with(['likes' => function ($query) use ($loggedInUserId) {
                $query->where('user_id', $loggedInUserId);
            }])
            ->with(['comments' => function ($query) {
                $query->with(['user:id,username,profileImagePath'])
                    ->latest();
            }])
            ->latest()
            ->get(['id', 'user_id', 'postText', 'postImagePath', 'created_at']);

        // Transform posts to add 'time_passed' and 'liked_by_auth_user'
        $posts->transform(function ($post) {
            $post->time_passed = $this->getTimePassed($post->created_at);
            $post->liked = $post->likes->isNotEmpty();
            unset($post->likes);

            // Add 'time_passed' for each comment
            $post->comments->transform(function ($comment) {
                $comment->time_passed = $this->getTimePassed($comment->created_at);
                return $comment;
            });

            return $post;
        });

        // Fetch users who are NOT friends with the logged-in user (suggestions)
        $nonFriends = User::where('id', '!=', $loggedInUserId)
            ->whereDoesntHave('followers', function ($query) use ($loggedInUserId) {
                $query->where('follower_id', $loggedInUserId);
            })
            ->select('id', 'username', 'profileImagePath')
            ->get();

        // Fetch friends of the logged-in user
        $friends = User::whereHas('followers', function ($query) use ($loggedInUserId) {
            $query->where('follower_id', $loggedInUserId);
        })
            ->select('id', 'username', 'profileImagePath')
            ->get();

        return Inertia::render('Home', [
            'posts' => $posts,
            'suggestions' => $nonFriends,
            'friends' => $friends, // ✅ Friends list added
        ]);
    }

    // Helper function to calculate time passed
    private function getTimePassed($createdAt)
    {
        return Carbon::parse($createdAt)->diffForHumans(Carbon::now());
    }

    // Store a new post
    public function store(Request $request)
    {
        $request->validate([
            'postText' => 'required|string|max:1000',
            'postImage' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        $postImagePath = null;
        if ($request->hasFile('postImage')) {
            $postImagePath = '/storage/' . $request->file('postImage')->store('post_images', 'public');
        }

        Post::create([
            'user_id' => Auth::id(),
            'postText' => $request->postText,
            'postImagePath' => $postImagePath,
        ]);

        return redirect()->route('posts.index');
    }

    // Delete a post
    public function destroy($postId)
    {
        $post = Post::findOrFail($postId); // Fetch the post using the provided ID

        if ($post->postImagePath) {
            Storage::disk('public')->delete($post->postImagePath);
        }

        $post->delete();

        return redirect()->back()->with('success', 'Successfully deleted the post.');
    }
}
