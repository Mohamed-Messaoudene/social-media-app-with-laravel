<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            // Share the authenticated user
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'username' => $request->user()->username,
                    'email' => $request->user()->email,
                    'profile_image_url' => $request->user()->profile_image_url,
                    'is_verified' => $request->user()->is_verified,
                ] : null,
            ],
            // Share validation errors so Inertia can pick them up
            'errors' => function () use ($request) {
                return $request->session()->get('errors')
                    ? $request->session()->get('errors')->getBag('default')->getMessages()
                    : (object)[];
            },

            // ── Suggestions (people you may know) ─────────────────────
            // Only load when authenticated
            'suggestions' => $request->user() ? [
                [
                    'id'               => 44,
                    'username'         => 'amira.design',
                    'profileImagePath' => 'https://i.pravatar.cc/150?u=amira.design',
                ],
                [
                    'id'               => 55,
                    'username'         => 'youcef_photo',
                    'profileImagePath' => 'https://i.pravatar.cc/150?u=youcef_photo',
                ],
                [
                    'id'               => 66,
                    'username'         => 'nassim.ui',
                    'profileImagePath' => 'https://i.pravatar.cc/150?u=nassim.ui',
                ],
            ] : [],

            // ── Friends (people auth user follows) ────────────────────
            'friends' => $request->user() ? [
                [
                    'id'               => 12,
                    'username'         => 'sarah_dev',
                    'profileImagePath' => 'https://i.pravatar.cc/150?u=sarah_dev',
                ],
                [
                    'id'               => 7,
                    'username'         => 'karim_runs',
                    'profileImagePath' => 'https://i.pravatar.cc/150?u=karim_runs',
                ],
                [
                    'id'               => 31,
                    'username'         => 'lina.codes',
                    'profileImagePath' => 'https://i.pravatar.cc/150?u=lina.codes',
                ],
                [
                    'id'               => 32,
                    'username'         => 'lina.codes',
                    'profileImagePath' => 'https://i.pravatar.cc/150?u=lina.codes',
                ],[
                    'id'               => 81,
                    'username'         => 'lina.codes',
                    'profileImagePath' => 'https://i.pravatar.cc/150?u=lina.codes',
                ],
            ] : [],

            // ── Online friends (active in last 5 min) ─────────────────
            'onlineFriends' => $request->user() ? [
                [
                    'id'               => 7,
                    'username'         => 'karim_runs',
                    'profileImagePath' => 'https://i.pravatar.cc/150?u=karim_runs',
                ],
                [
                    'id'               => 31,
                    'username'         => 'lina.codes',
                    'profileImagePath' => 'https://i.pravatar.cc/150?u=lina.codes',
                ],
                [
                    'id'               => 44,
                    'username'         => 'amira.design',
                    'profileImagePath' => 'https://i.pravatar.cc/150?u=amira.design',
                ],
                [
                    'id'               => 55,
                    'username'         => 'youcef_photo',
                    'profileImagePath' => 'https://i.pravatar.cc/150?u=youcef_photo',
                ],
                [
                    'id'               => 66,
                    'username'         => 'nassim.ui',
                    'profileImagePath' => 'https://i.pravatar.cc/150?u=nassim.ui',
                ],
                 [
                    'id'               => 67,
                    'username'         => 'nassim.ui',
                    'profileImagePath' => 'https://i.pravatar.cc/150?u=nassim.ui',
                ], [
                    'id'               => 68,
                    'username'         => 'nassim.ui',
                    'profileImagePath' => 'https://i.pravatar.cc/150?u=nassim.ui',
                ], [
                    'id'               => 69,
                    'username'         => 'nassim.ui',
                    'profileImagePath' => 'https://i.pravatar.cc/150?u=nassim.ui',
                ],

            ] : [],

        ]);
    }
}
