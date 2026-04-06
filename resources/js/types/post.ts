export interface PostDate {
    raw: string | null;
    diff: string | null;
}

export interface Post {
    id: number;
    content: string;
    image_url: string | null;

    likes_count: number;
    comments_count: number;
    comments_enabled: boolean;

    published_at: PostDate;

    is_liked_by_auth: boolean;
}