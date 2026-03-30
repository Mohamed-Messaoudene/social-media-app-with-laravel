<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Anyone can register
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            // Required fields only (minimal registration)
            'username' => [
                'required',
                'string',
                'min:3',
                'max:30',
                'unique:users,username',
                'regex:/^[a-zA-Z0-9_]+$/', // Only alphanumeric and underscore
            ],
            'email' => [
                'required',
                'string',
                'email:rfc,dns', // Validate real email format
                'max:255',
                'unique:users,email',
            ],
            'password' => [
                'required',
                'string',
                'confirmed', // Requires password_confirmation field
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
                    ->uncompromised(), // Check against leaked password database
            ],
            
            // Optional fields (can be added during profile setup)
            'first_name' => ['nullable', 'string', 'max:50'],
            'last_name' => ['nullable', 'string', 'max:50'],
            'birth_date' => ['nullable', 'date', 'before:today', 'after:1900-01-01'],
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'username.required' => 'Please enter a username.',
            'username.unique' => 'This username is already taken.',
            'username.regex' => 'Username can only contain letters, numbers, and underscores.',
            'username.min' => 'Username must be at least 3 characters.',
            'email.required' => 'Please enter your email address.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'An account with this email already exists.',
            'password.required' => 'Please enter a password.',
            'password.confirmed' => 'Password confirmation does not match.',
            'birth_date.before' => 'You must be born before today.',
            'birth_date.after' => 'Please enter a valid birth date.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Sanitize username (convert to lowercase, trim)
        if ($this->has('username')) {
            $this->merge([
                'username' => strtolower(trim($this->username)),
            ]);
        }

        // Sanitize email
        if ($this->has('email')) {
            $this->merge([
                'email' => strtolower(trim($this->email)),
            ]);
        }
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'username' => 'username',
            'email' => 'email address',
            'password' => 'password',
            'first_name' => 'first name',
            'last_name' => 'last name',
            'birth_date' => 'date of birth',
        ];
    }
}