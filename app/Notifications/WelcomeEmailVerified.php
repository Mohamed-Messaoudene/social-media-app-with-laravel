<?php
// app/Notifications/WelcomeEmailVerified.php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeEmailVerified extends Notification implements ShouldQueue
{
    use Queueable;

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Welcome to ' . config('app.name') . '! 🎉')
            ->greeting('Congratulations, ' . $notifiable->username . '!')
            ->line('Your email has been verified successfully.')
            ->line('You now have full access to all features:')
            ->line('✓ Create and share posts')
            ->line('✓ Follow other users')
            ->line('✓ Comment and like content')
            ->line('✓ Send direct messages')
            ->action('Complete Your Profile', route('profile.edit'))
            ->line('Start connecting with friends and sharing your story!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Email Verified!',
            'message' => 'Your email has been verified. Welcome to ' . config('app.name') . '!',
            'action_url' => route('profile.edit'),
        ];
    }
}