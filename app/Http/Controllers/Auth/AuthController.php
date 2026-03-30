<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class AuthController extends Controller
{
    /**
     * Show registration form.
     */
    public function showRegister(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Register a new user.
     * 
     * Registration Flow:
     * 1. Validate input (minimal fields)
     * 2. Create user account
     * 3. Send email verification
     * 4. Log user in
     * 5. Redirect to email verification notice
     * 
     * Profile images are NOT required at registration.
     * Users complete their profile after email verification.
     */
    public function register(RegisterRequest $request): RedirectResponse
    {
        try {
            Log::info("Attempting registration for email: {$request->email}", [
                'ip' => $request->ip(),
            ]);
            DB::beginTransaction();

            // Create user with minimal required fields
            $user = User::create([
                'username' => $request->username,
                'email' => $request->email,
                'password' => $request->password, // Auto-hashed by cast
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'birth_date' => $request->birth_date,
                
                // Set defaults for optional fields
                'is_active' => true,
                'is_verified' => false,
                'is_private' => false,
                
                // Profile images will be null (user adds them later)
                'profile_image_path' => null,
                'cover_image_path' => null,
                'bio' => null,
                'location' => null,
            ]);

            DB::commit();

            // Fire registered event (triggers email verification)
            event(new Registered($user));

            // Log user in immediately
            Auth::login($user);

            // Update last login timestamp
            $user->updateLastLogin();

            Log::info("New user registered", [
                'user_id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
            ]);

            // Redirect to email verification notice
            return redirect()->route('verification.notice')->with('success', 'Account created! Please verify your email.');

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error("Registration failed", [
                'error' => $e->getMessage(),
                'email' => $request->email,
            ]);

            return back()->withErrors([
                'error' => 'Registration failed. Please try again.',
            ])->withInput($request->except('password'));
        }
    }

    /**
     * Show login form.
     */
    public function showLogin(): Response
    {
        Log::info("Showing login form", [
            'ip' => request()->ip(),
        ]);
        return Inertia::render('Auth/Login');
    }

    /**
     * Authenticate user and log them in.
     */
    public function login(LoginRequest $request): RedirectResponse
{
    $request->authenticate();

    $request->session()->regenerate();

    $user = Auth::user();
    $user->updateLastLogin();

    Log::info("User logged in", [
        'user_id' => $user->id,
        'username' => $user->username,
        'ip' => $request->ip(),
    ]);

    return redirect()->intended(route('home'))
        ->with('success', 'Welcome back!');
}

    /**
     * Log the user out.
     */
    public function logout(): RedirectResponse
    {
        $userId = Auth::id();

        Auth::logout();

        request()->session()->invalidate();
        request()->session()->regenerateToken();

        Log::info("User logged out", ['user_id' => $userId]);

        return redirect()->route('login')->with('success', 'Logged out successfully.');
    }
}