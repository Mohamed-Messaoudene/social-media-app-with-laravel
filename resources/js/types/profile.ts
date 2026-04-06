import { PaginatedResponse } from "./common";
import { SharedProps } from "./global";
import { Post } from "./post";

export interface ProfileUser {
    id: number;
    username: string;
    full_name: string;
    bio: string | null;
    profile_image_url: string | null;
    cover_image_url: string | null;
    location: string | null;
}

export interface ProfileStats {
    followers_count: number;
    following_count: number;
    posts_count: number;
}

export interface ProfileRelationship {
    is_following: boolean;
    is_followed_by: boolean;
    is_own_profile: boolean;
    is_private: boolean;
}

export interface ProfilePageProps extends SharedProps {
    user: ProfileUser;
    stats: ProfileStats;
    relationships: ProfileRelationship;
    posts: PaginatedResponse<Post> | null;
}
