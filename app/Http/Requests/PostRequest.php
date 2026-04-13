<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class PostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'post_content'          => ['required', 'string', 'max:5000'],
            'image'            => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'visibility'       => ['required', 'in:public,followers,private'], // 'friends' → 'followers' to match DB scope
            'comments_enabled' => ['required', 'boolean'],
            'published_at'     => ['nullable', 'date', 'after_or_equal:now'],

        ];
    }

    // custom messages (optional)
    public function messages(): array
    {
        return [
            'post_content.required' => 'Post content is required.',
            'post_content.max' => 'Post content cannot exceed 5000 characters.',
            'image.image' => 'The uploaded file must be an image.',
            'image.max' => 'The image size cannot exceed 5MB.',
            'visibility.in' => 'Invalid visibility option selected.',
            'comments_enabled.boolean' => 'Comments enabled must be true or false.',
            'published_at.date' => 'Published at must be a valid date.',
            'published_at.after_or_equal' => 'Published at cannot be in the past.',
        ];
    }

    // optional: prepare data before validation (e.g., convert comments_enabled to boolean)
    protected function prepareForValidation(): void
    {
        $this->merge([
            'visibility' => $this->input('visibility', 'public'), // default here
            'comments_enabled' => filter_var(
                $this->input('comments_enabled', true),
                FILTER_VALIDATE_BOOLEAN
            ),
        ]);

        if (empty($this->input('published_at'))) {
            $this->merge(['published_at' => null]);
        }
    }
}
