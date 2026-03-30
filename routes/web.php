<?php

use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\EmailVerificationController;
// use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\PostController;
// use App\Http\Controllers\CommentController;
// use App\Http\Controllers\LikeController;
use App\Http\Controllers\ProfileController;
// use App\Http\Controllers\FollowController;
// use App\Http\Controllers\StoryController;
// use App\Http\Controllers\NotificationController;
// use App\Http\Controllers\SearchController;
// use App\Http\Controllers\BookmarkController;
// use App\Http\Controllers\MessageController;

/*
|--------------------------------------------------------------------------
| Guest Routes (Unauthenticated Users)
|--------------------------------------------------------------------------
| CSRF Protection: ✅ Automatic (via VerifyCsrfToken middleware)
| Session-based: ✅ Uses Laravel sessions
*/

Route::middleware('guest')->group(function () {
    // Landing
    // redirect to home route
    Route::get('/', fn() => redirect()->route('login'));

    // Registration
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register.show');
    Route::post('/register', [AuthController::class, 'register'])->name('register');

    // Login
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login.show');
    Route::post('/login', [AuthController::class, 'login'])->name('login');

    // // Password Reset
    // Route::get('/forgot-password', [PasswordResetController::class, 'showForgotPassword'])
    //     ->name('password.request');
    // Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink'])
    //     ->name('password.email');
    // Route::get('/reset-password/{token}', [PasswordResetController::class, 'showResetForm'])
    //     ->name('password.reset');
    // Route::post('/reset-password', [PasswordResetController::class, 'resetPassword'])
    //     ->name('password.update');
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes (Logged-in Users)
|--------------------------------------------------------------------------
| CSRF Protection: ✅ Automatic
| Auth Check: ✅ Via 'auth' middleware
| Email Verification: ✅ Via 'verified' middleware
*/

Route::middleware(['auth', 'verified'])->group(function () {

    // ==================== HOME & FEED ====================
    Route::get('/home', [PostController::class, 'index'])->name('home');
    // Route::get('/explore', [PostController::class, 'explore'])->name('explore');
    // Route::get('/trending', [PostController::class, 'trending'])->name('trending');

    // ==================== POSTS ====================
    // Route::prefix('posts')->name('posts.')->group(function () {
    //     Route::post('/', [PostController::class, 'store'])->name('store');
    //     Route::get('/{post}', [PostController::class, 'show'])->name('show');
    //     Route::put('/{post}', [PostController::class, 'update'])->name('update');
    //     Route::delete('/{post}', [PostController::class, 'destroy'])->name('destroy');

    //     // Post interactions
    //     Route::post('/{post}/like', [LikeController::class, 'toggleLike'])->name('like');
    //     Route::post('/{post}/bookmark', [BookmarkController::class, 'toggle'])->name('bookmark');

    //     // Comments
    //     Route::post('/{post}/comments', [CommentController::class, 'store'])->name('comments.store');
    //     Route::put('/comments/{comment}', [CommentController::class, 'update'])->name('comments.update');
    //     Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');
    //     Route::post('/comments/{comment}/like', [LikeController::class, 'toggleCommentLike'])->name('comments.like');
    //     Route::post('/comments/{comment}/reply', [CommentController::class, 'reply'])->name('comments.reply');
    // });

    // ==================== STORIES ====================
    // Route::prefix('stories')->name('stories.')->group(function () {
    //     Route::get('/', [StoryController::class, 'index'])->name('index');
    //     Route::post('/', [StoryController::class, 'store'])->name('store');
    //     Route::delete('/{story}', [StoryController::class, 'destroy'])->name('destroy');
    //     Route::post('/{story}/view', [StoryController::class, 'markAsViewed'])->name('view');
    // });

    // ==================== PROFILE ====================
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.edit');
    // Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar');
    // Route::post('/profile/cover', [ProfileController::class, 'updateCover'])->name('profile.cover');

    // Other users
    // Route::get('/{username}', [ProfileController::class, 'showPublic'])->name('user.profile');

    // ==================== FOLLOW SYSTEM ====================
    // Route::post('/users/{user}/follow', [FollowController::class, 'follow'])->name('users.follow');
    // Route::delete('/users/{user}/unfollow', [FollowController::class, 'unfollow'])->name('users.unfollow');
    
    // Follow requests
    // Route::get('/follow-requests', [FollowController::class, 'pendingRequests'])->name('follow-requests.index');
    // Route::post('/follow-requests/{follow}/accept', [FollowController::class, 'accept'])->name('follow-requests.accept');
    // Route::post('/follow-requests/{follow}/reject', [FollowController::class, 'reject'])->name('follow-requests.reject');

    // ==================== NOTIFICATIONS ====================
    // Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    // Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    // Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');

    // ==================== MESSAGES ====================
    // Route::prefix('messages')->name('messages.')->group(function () {
    //     Route::get('/', [MessageController::class, 'index'])->name('index');
    //     Route::post('/', [MessageController::class, 'createConversation'])->name('create');
    //     Route::get('/{conversation}', [MessageController::class, 'show'])->name('show');
    //     Route::post('/{conversation}', [MessageController::class, 'send'])->name('send');
    //     Route::delete('/{conversation}', [MessageController::class, 'delete'])->name('delete');
    // });

    // ==================== BOOKMARKS ====================
    // Route::get('/bookmarks', [BookmarkController::class, 'index'])->name('bookmarks.index');

    // // ==================== SEARCH ====================
    // Route::get('/search', [SearchController::class, 'index'])->name('search.index');

    // // ==================== LOGOUT ====================
    // Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

/*
|--------------------------------------------------------------------------
| Email Verification Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    Route::get('/email/verify', [EmailVerificationController::class, 'notice'])
        ->name('verification.notice');

    Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('/email/verification-notification', [EmailVerificationController::class, 'resend'])
        ->middleware('throttle:6,1')
        ->name('verification.send');
});