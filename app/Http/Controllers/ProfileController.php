<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    // Get profile information for a specific user
    public function show(Request $request, User $user)
    {
        $authUser = $request->user();
        $isOwnProfile = $authUser?->id === $user->id;

        // ✅ Correct counts (aligned with visibility)
        $user->loadCount([
            'followers',
            'following',
            'posts as posts_count' => function ($query) use ($authUser) {
                $query->published()->visibleTo($authUser);
            }
        ]);

        $posts = $user->posts()
            ->published()
            ->visibleTo($authUser)
            ->withExists([
                'likes as is_liked_by_auth' => function ($query) use ($authUser) {
                    $query->where('user_id', $authUser?->id);
                }
            ])
            ->latest('published_at')
            ->paginate(10)
            ->through(fn($post) => [
                'id' => $post->id,
                'content' => $post->content,
                'image_url' => $post->image_url,

                'likes_count' => $post->likes_count,
                'comments_count' => $post->comments_count,
                'comments_enabled' => $post->comments_enabled,

                'published_at' => [
                    'raw' => $post->published_at?->toISOString(),
                    'diff' => $post->published_at?->diffForHumans(),
                ],

                'is_liked_by_auth' => $post->is_liked_by_auth,
            ]);

        return Inertia::render('Profile', [
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'location' => $user->location,
                'profile_image_url' => $user->profile_image_url,
                'cover_image_url' => $user->cover_image_url,
            ],

            'stats' => [
                'followers_count' => $user->followers_count,
                'following_count' => $user->following_count,
                'posts_count' => $user->posts_count,
            ],

            'relationships' => [
                'is_following' => !$isOwnProfile && $authUser
                    ? $authUser->isFollowing($user)
                    : false,

                'is_followed_by' => !$isOwnProfile && $authUser
                    ? $authUser->isFollowedBy($user)
                    : false,

                'is_own_profile' => $isOwnProfile,
                'is_private' => $user->is_private,
            ],

            'posts' => $posts,
        ]);
        
    }


    // Helper function to calculate time passed
    private function getTimePassed($createdAt)
    {
        $now = now();
        $createdAt = \Carbon\Carbon::parse($createdAt);
        return $createdAt->diffForHumans($now); // Get human-readable time difference
    }
    public function update(Request $request, User $user)
    {
        $request->validate([
            'email' => 'required|email|unique:users,email,' . $user->id,
            'username' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'profileImage' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'covertureImage' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Update user data
        $user->update($request->only(['email', 'username', 'location']));

        // Handle profile image upload
        if ($request->hasFile('profileImage')) {
            $user->profileImagePath = '/storage//' . $request->file('profileImage')->store('profile_images', 'public');
        }

        // Handle cover image upload
        if ($request->hasFile('covertureImage')) {
            $user->covertureImagePath = '/storage//' . $request->file('covertureImage')->store('coverture_images', 'public');
        }

        $user->save();

        return redirect()->route('showProfile', ["userId" => $user->id])->with('success', 'Profile updated successfully!');
    }
}
