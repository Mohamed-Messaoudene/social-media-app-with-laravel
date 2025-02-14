<?php

namespace App\Http\Controllers;


class FollowController extends Controller
{

public function followUser($userId)
{
    $authUser = auth()->user();

    // Check if the authenticated user is not trying to follow themselves
    if ($authUser->id == $userId) {
        return response()->json(['error' => 'You cannot follow yourself.'], 400);
    }

    // Check if the user is already following
    if ($authUser->following()->where('following_id', $userId)->exists()) {
        return response()->json(['message' => 'Already following this user.']);
    }

    // Create follow record
    $authUser->following()->attach($userId);

    return redirect()->back()->with('success', 'Successfully followed the user.');

}

public function unfollowUser($userId)
{
    $authUser = auth()->user();

    // Check if the authenticated user is actually following the user
    if (!$authUser->following()->where('following_id', $userId)->exists()) {
        return response()->json(['message' => 'You are not following this user.']);
    }

    // Remove follow record
    $authUser->following()->detach($userId);

    return redirect()->back( )->with('success', 'Successfully unfollowed the user.');

}
}