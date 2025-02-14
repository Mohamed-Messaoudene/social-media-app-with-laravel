<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    // Get profile information for a specific user
    public function getProfileInfo($userId)
    {
        try {
            $authUserId = auth()->id(); // Get authenticated user ID
    
            // Find the user by ID
            $user = User::withCount(['followers', 'following']) // Count followers and following
                ->with([
                    'posts' => function ($query) use ($authUserId) {
                        $query->latest()
                            ->with([
                                'comments' => function ($query) {
                                    $query->with('user:id,username,profileImagePath')->latest();
                                },
                                'user:id,username,profileImagePath',
                                'likes' // Load likes relationship
                            ])
                            ->withCount('likes') // Get the number of likes for each post
                            ->withExists(['likes as liked_by_user' => function ($query) use ($authUserId) {
                                $query->where('user_id', $authUserId); // Check if the user liked the post
                            }]);
                    }
                ])
                ->findOrFail($userId);
    
            // Check if the authenticated user follows this profile
            $isFollowing = $authUserId ? $user->followers()->where('follower_id', $authUserId)->exists() : false;
    
            return Inertia::render('Profile', [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'location' => $user->location,
                    'profileImagePath' => $user->profileImagePath,
                    'covertureImagePath' => $user->covertureImagePath,
                    'followers_count' => $user->followers_count,
                    'following_count' => $user->following_count,
                    'is_following' => $isFollowing, // Add this field to indicate if the user follows this profile
                ],
                'posts' => $user->posts->map(function ($post) {
                    return [
                        'id' => $post->id,
                        'postText' => $post->postText,
                        'postImagePath' => $post->postImagePath,
                        'created_at' => $post->created_at,
                        'time_passed' => $this->getTimePassed($post->created_at),
                        'user' => [
                            'id' => $post->user->id,
                            'username' => $post->user->username,
                            'profileImagePath' => $post->user->profileImagePath,
                        ],
                        'likes_count' => $post->likes_count, // Number of likes
                        'liked' => $post->liked_by_user, // Boolean if user liked it
                        'comments' => $post->comments->map(function ($comment) {
                            return [
                                'id' => $comment->id,
                                'comment_text' => $comment->comment_text,
                                'created_at' => $comment->created_at,
                                'time_passed' => $this->getTimePassed($comment->created_at),
                                'user' => [
                                    'id' => $comment->user->id,
                                    'username' => $comment->user->username,
                                    'profileImagePath' => $comment->user->profileImagePath,
                                ],
                            ];
                        }),
                    ];
                }),
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'User not found or an error occurred.']);
        }
    }    

    // Helper function to calculate time passed
    private function getTimePassed($createdAt)
    {
        $now = now();
        $createdAt = \Carbon\Carbon::parse($createdAt);
        return $createdAt->diffForHumans($now); // Get human-readable time difference
    }
    public function updateProfile(Request $request, $id)
    {
        $user = User::findOrFail($id);
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

        auth()->user()->refresh();

        return redirect()->route('showProfile', ["userId" => $id])->with('success', 'Profile updated successfully!');
    }
}
