<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationController extends Controller
{
    /**
     * Display the email verification notice.
     * 
     * Shows a page telling the user to check their email.
     * Includes a "Resend Verification Email" button.
     */
    public function notice(Request $request): Response|RedirectResponse
    {
        // If already verified, redirect to home
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->route('profile.show', $request->user());
        }

        return Inertia::render('Auth/VerifyEmail', [
            'status' => session('status'),
            'email' => $request->user()->email,
        ]);
    }

    /**
     * Handle the email verification.
     * 
     * This is called when the user clicks the verification link in their email.
     * URL format: /email/verify/{id}/{hash}?expires=...&signature=...
     */
    public function verify(EmailVerificationRequest $request): RedirectResponse
    {
        // Check if already verified
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->route('profile.show', $request->user())->with('info', 'Your email is already verified.');
        }

        // Mark email as verified
        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));

            Log::info("Email verified", [
                'user_id' => $request->user()->id,
                'email' => $request->user()->email,
            ]);
        }

        // Redirect to profile setup (where user can add photos, bio, etc.)
        return redirect()->route('profile.show',$request->user() )->with('success', 'Email verified! Complete your profile to get started.');
    }

    /**
     * Resend the email verification notification.
     * 
     * Called when user clicks "Resend Verification Email" button.
     */
    public function resend(Request $request): RedirectResponse
    {
        // Check if already verified
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->route('home');
        }

        // Send new verification email
        $request->user()->sendEmailVerificationNotification();

        Log::info("Verification email resent", [
            'user_id' => $request->user()->id,
            'email' => $request->user()->email,
        ]);

        return back()->with('status', 'Verification link sent! Please check your email.');
    }
}