export type Post = {
    id: number, 
    content: string,
    created_at: string,
    slug: string,
    user_id: string,
    image: string | null, 
    username: string;
    likesCount: number;
    likedByCurrentUser: boolean;
}