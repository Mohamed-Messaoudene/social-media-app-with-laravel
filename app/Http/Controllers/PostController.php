<?php

namespace App\Http\Controllers;

use App\Http\Requests\PostRequest;
use App\Models\Post;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;

class PostController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Home', [

            // Posts (paginated feed) ─────────────────────────────────
            'posts' => [
                'data' => [
                    [
                        'id'               => 1,
                        'content'          => 'Just shipped a new feature! 🚀 Really proud of how the team pulled together on this one. Three weeks of late nights finally paying off.',
                        'image_url'        => 'https://picsum.photos/seed/post1/800/500',
                        'likes_count'      => 142,
                        'comments_count'   => 38,
                        'comments_enabled' => true,
                        'published_at'     => [
                            'raw'  => '2026-04-04T18:30:00Z',
                            'diff' => '5 hours ago',
                        ],
                        'is_liked_by_auth' => false,
                        'author' => [
                            'id'                => 12,
                            'username'          => 'sarah_dev',
                            'profile_image_url' => 'https://i.pravatar.cc/150?u=sarah_dev',
                        ],
                    ],
                    [
                        'id'               => 2,
                        'content'          => 'Morning run ✅ 10km in 48 minutes. New personal best! The consistency is finally starting to show.',
                        'image_url'        => null,
                        'likes_count'      => 87,
                        'comments_count'   => 14,
                        'comments_enabled' => true,
                        'published_at'     => [
                            'raw'  => '2026-04-04T07:15:00Z',
                            'diff' => '16 hours ago',
                        ],
                        'is_liked_by_auth' => true,
                        'author' => [
                            'id'                => 7,
                            'username'          => 'karim_runs',
                            'profile_image_url' => 'https://i.pravatar.cc/150?u=karim_runs',
                        ],
                    ],
                    [
                        'id'               => 3,
                        'content'          => 'Reading "Designing Data-Intensive Applications" for the second time. Hits differently when you\'ve actually encountered these problems in production.',
                        'image_url'        => 'https://picsum.photos/seed/post3/800/500',
                        'likes_count'      => 203,
                        'comments_count'   => 61,
                        'comments_enabled' => true,
                        'published_at'     => [
                            'raw'  => '2026-04-03T14:00:00Z',
                            'diff' => '1 day ago',
                        ],
                        'is_liked_by_auth' => false,
                        'author' => [
                            'id'                => 31,
                            'username'          => 'lina.codes',
                            'profile_image_url' => 'https://i.pravatar.cc/150?u=lina.codes',
                        ],
                    ],
                ],

                // Laravel pagination meta
                'current_page' => 1,
                'last_page'    => 8,
                'per_page'     => 15,
                'total'        => 112,
                'next_page_url' => '/home?page=2',
                'prev_page_url' => null,
            ],
          
        ]);
    }

    /**
     * Handle create new post request.
     * Validation is done via PostRequest which checks:
     * - content is required and max 500 chars
     * - image is optional but must be an image file if present
     * - visibility is required and must be one of: public, friends, private
     * - comments_enabled is required and must be boolean
     * published_at is optional but must be a valid datetime if present
     * 
     * Post Creation Flow:
     * 1. Validate input
     * 2. Create post record (is_published=false if scheduled for future)
     * 3. If image uploaded, store it and update post record with image path
     * 4. If scheduled, set up a job to publish the post at the right
     * time (not implemented in this snippet)
     * 5. Redirect back to feed with success message
     * Note: For simplicity, this example does not handle the scheduling logic or image processing. Those would be important to implement in a production app.
     */
    public function store(PostRequest $request): RedirectResponse
    {
        // ✅ Atomic — either everything succeeds or nothing is saved
        DB::transaction(function () use ($request) {
            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('post_images', 'public');
            }

            Post::create([
                'user_id'          => $request->user()->id,
                'content'          => $request->post_content,
                'image_path'       => $imagePath,
                'visibility'       => $request->visibility,
                'comments_enabled' => $request->comments_enabled,
                'published_at'     => $request->published_at,
                'is_published'     => !$request->published_at || $request->published_at <= now(),
            ]);
        });

        // Note: Scheduling logic  if published_at
        // would typically involve dispatching a job to publish the post at the right time.


        return redirect()->route('home')->with('success', 'Post created successfully!');
    }

    // delete and update methods would go here, following similar patterns for validation and database operations.
    public function destroy(Post $post): RedirectResponse
    {
        // Authorization check (e.g., only post owner can delete)
        $this->authorize('delete', $post);

        $post->delete();

        return redirect()->route('home')->with('success', 'Post deleted successfully!');
    }
}