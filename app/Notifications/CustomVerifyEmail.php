<?php
// app/Notifications/CustomVerifyEmail.php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as BaseVerifyEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

class CustomVerifyEmail extends BaseVerifyEmail implements ShouldQueue
{
    use Queueable;

    /**
     * Get the notification's delivery channels.
     * 
     * ✅ FIXED: Removed type hint to match parent class
     */
    public function via($notifiable): array
    {
        return ['mail'];
    }

    /**
     * Build the mail representation of the notification.
     * 
     * ✅ FIXED: Removed type hint to match parent class
     */
    public function toMail($notifiable): MailMessage
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject('Verify Your Email Address - ' . config('app.name'))
            ->view(
                'emails.verification-email', // ← Our custom Blade view
                [
                    'user' => $notifiable,
                    'verificationUrl' => $verificationUrl,
                    'expiresInMinutes' => Config::get('auth.verification.expire', 60),
                    'appName' => config('app.name'),
                    'supportEmail' => 'support@yoursocialapp.com',
                    'year' => date('Y'),
                ]
            );
    }

    /**
     * Get the verification URL for the given notifiable.
     * 
     * ✅ FIXED: Removed type hint for consistency
     */
    protected function verificationUrl($notifiable): string
    {
        return URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );
    }
}