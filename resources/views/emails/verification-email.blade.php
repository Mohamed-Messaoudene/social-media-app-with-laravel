{{-- resources/views/emails/verification-email.blade.php --}}

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - {{ $appName }}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f4f4f5;
        }
        
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 50px 30px;
            text-align: center;
            color: white;
        }
        
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 22px;
            font-weight: 600;
            color: #18181b;
            margin-bottom: 20px;
        }
        
        .text {
            color: #52525b;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        
        .button-container {
            text-align: center;
            margin: 40px 0;
        }
        
        .verify-button {
            display: inline-block;
            padding: 16px 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            transition: transform 0.2s;
        }
        
        .verify-button:hover {
            transform: translateY(-2px);
        }
        
        .warning-box {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 16px;
            margin: 30px 0;
            border-radius: 4px;
        }
        
        .info-box {
            background-color: #eff6ff;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
        }
        
        .link-text {
            word-break: break-all;
            background-color: #f4f4f5;
            padding: 12px;
            border-radius: 4px;
            font-size: 12px;
            color: #52525b;
        }
        
        .footer {
            background-color: #fafafa;
            padding: 30px;
            text-align: center;
            color: #71717a;
            font-size: 14px;
            border-top: 1px solid #e4e4e7;
        }
        
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
        
        @media only screen and (max-width: 600px) {
            .container {
                margin: 0;
                border-radius: 0;
            }
            
            .content {
                padding: 20px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .verify-button {
                display: block;
                padding: 14px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🔐 Verify Your Email Address</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Hey {{ $user->username }}! 👋
            </div>

            <p class="text">
                Thanks for signing up for <strong>{{ $appName }}</strong>! 
                We're excited to have you on board.
            </p>

            <p class="text">
                To complete your registration and start using your account, 
                please verify your email address by clicking the button below:
            </p>

            <!-- Verify Button -->
            <div class="button-container">
                <a href="{{ $verificationUrl }}" class="verify-button">
                    Verify Email Address
                </a>
            </div>

            <!-- Warning -->
            <div class="warning-box">
                <p style="margin: 0; color: #92400e;">
                    <strong>⏰ Important:</strong> This verification link will expire in 
                    <strong>{{ $expiresInMinutes }} minutes</strong>.
                </p>
            </div>

            <!-- Alternative Link -->
            <p class="text" style="color: #71717a; font-size: 14px;">
                If the button above doesn't work, copy and paste this URL into your browser:
            </p>
            <p class="link-text">
                {{ $verificationUrl }}
            </p>

            <!-- What's Next -->
            <div class="info-box">
                <h3 style="margin-top: 0; color: #1e40af; font-size: 18px;">
                    ✨ What Happens After Verification?
                </h3>
                <ul style="color: #52525b; margin: 10px 0; padding-left: 20px;">
                    <li>Complete your profile with a photo and bio</li>
                    <li>Start following people and discover content</li>
                    <li>Create your first post and share with the community</li>
                    <li>Unlock all features of {{ $appName }}</li>
                </ul>
            </div>

            <!-- Disclaimer -->
            <p class="text" style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e4e4e7; color: #71717a; font-size: 14px;">
                If you did not create an account with {{ $appName }}, no further action is required. 
                This link will expire automatically.
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p style="margin: 0 0 10px;">
                Need help? Contact us at 
                <a href="mailto:{{ $supportEmail }}">{{ $supportEmail }}</a>
            </p>
            <p style="margin: 10px 0; color: #a1a1aa; font-size: 12px;">
                © {{ $year }} {{ $appName }}. All rights reserved.
            </p>
            <p style="margin: 10px 0; color: #a1a1aa; font-size: 12px;">
                This email was sent to {{ $user->email }}
            </p>
        </div>
    </div>
</body>
</html>