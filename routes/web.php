<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FollowController;

use Inertia\Inertia;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Login');
});

// Authentication Routes
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register']);
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
Route::get('/sidali', [AuthController::class, 'index']);

// Post Management Routes
Route::middleware('auth')->group(function () {
    Route::get('/', [PostController::class, 'index'])->name('posts.index');
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
    Route::delete('/posts/{postId}', [PostController::class, 'destroy'])->name('posts.destroy');
});

// Comment Management Routes
Route::middleware('auth')->group(function () {
    Route::post('/posts/{post}/comments', [CommentController::class, 'store'])->name('comments.store');
});

// Like Management Routes
Route::middleware('auth')->group(function () {
    Route::post('/posts/{postId}/likes', [LikeController::class, 'like'])->name('likes.like');
    Route::delete('/posts/{postId}/likes', [LikeController::class, 'unlike'])->name('likes.unlike');
});
// profile Management Routes
Route::middleware('auth')->group(function () {
    Route::get('/profile/{userId}', [ProfileController::class, 'getProfileInfo'])->name('showProfile');
    Route::post('/profile/{userId}', [ProfileController::class, 'updateProfile']);
    Route::post('/profile/{userId}/follow', [FollowController::class, 'followUser']);
    Route::post('/profile/{userId}/unfollow', [FollowController::class, 'unfollowUser']);
});
