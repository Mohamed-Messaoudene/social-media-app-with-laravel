<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Home', [

            // ── Posts (paginated feed) ─────────────────────────────────
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
}