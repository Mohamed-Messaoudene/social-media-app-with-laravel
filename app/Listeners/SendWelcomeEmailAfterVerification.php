<?php
// app/Listeners/SendWelcomeEmailAfterVerification.php

namespace App\Listeners;

use App\Notifications\WelcomeEmailVerified;
use Illuminate\Auth\Events\Verified;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class SendWelcomeEmailAfterVerification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     */
    public function handle(Verified $event): void
    {
        // Send welcome email to verified user
        /** @var User $user */
        $user = $event->user;

        $user->notify(new WelcomeEmailVerified());

        Log::info('Welcome email sent to verified user', [
            'user_id' => $user->id,
            'email' => $user->email,
        ]);
    }
}