export function getAvatarUrl(userId: string | null) {
    if (!userId) return;

    return `https://zjlhxbimfkzninrfzaiy.supabase.co/storage/v1/object/public/avatars-enddit/${userId}.avatar`;
}