<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Http;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;


    public $url = "http://127.0.0.1:8080/";
        // Authenticate to the external API and get the token
        public function authenticate()
        {
            $authUrl = $this->url.'api/login';
            $credentials = [
                'email' => 'user@example.com',
                'password' => 'string',
            ];
    
            $response = Http::post($authUrl, $credentials);
    
            if ($response->successful()) {
                return $response->json()['token']; // Return the token
            }
    
            return response()->json([
                'error' => 'Authentication failed',
                'status' => $response->status(),
            ], $response->status());
        }
    
}