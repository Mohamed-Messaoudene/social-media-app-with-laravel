<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    public $url = "http://127.0.0.1:8080/";

    public function index()
    {   
        $token = $this->authenticate();
        $postsUrl = $this->url . 'api/posts';
        $responsePosts = Http::withToken($token)->get($postsUrl);
        $posts = $responsePosts->json();
        return $posts;
    }

    // Show registration form
    public function showRegister()
    {
        return Inertia::render('/Register');
    }

    // Handle registration
    public function register(Request $request)
    {
        try {
            // Validate the request data
            $request->validate([
                'username' => 'required|string|max:255|unique:users',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'location' => 'nullable|string|max:255',
                'profileImage' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB max
                'covertureImage' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB max
            ]);

            // Handle profile image upload
            $profileImagePath = null;
            if ($request->hasFile('profileImage')) {
                $profileImagePath = '/storage//'.$request->file('profileImage')->store('profile_images', 'public');
            }

            // Handle coverture image upload
            $covertureImagePath = null;
            if ($request->hasFile('covertureImage')) {
                $covertureImagePath = '/storage//'.$request->file('covertureImage')->store('coverture_images', 'public');
            }
            // dd($covertureImagePath,$profileImagePath);

            // Create the user
            $user = User::create([
                'username' => $request->username,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'location' => $request->location,
                'profileImagePath' => $profileImagePath,
                'covertureImagePath' => $covertureImagePath,
            ]);
            // dd($user);

            // Log in the user
            Auth::login($user);

            // Return a success response
            return redirect()->route('login')->with('success', 'Registration successful!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Handle validation errors
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            // Handle other exceptions (e.g., database errors)
            return back()->withErrors(['error' => 'An error occurred during registration. Please try again.'])->withInput();
        }
    }

    // Show login form
    public function showLogin()
    {
        return Inertia::render('/Login');
    }

    // Handle login
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            return redirect()->route('posts.index');
        }

        return back()->withErrors(['email' => 'Invalid credentials']);
    }

    // Handle logout
    public function logout()
    {
        Auth::logout();
        return redirect()->route('login');
    }
}
