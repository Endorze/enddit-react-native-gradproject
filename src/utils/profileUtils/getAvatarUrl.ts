import { useCallback, useState } from "react";

export function getAvatarUrl(userId: string) {
    const random = new Date().valueOf();
    return `https://zjlhxbimfkzninrfzaiy.supabase.co/storage/v1/object/public/avatars-enddit/${userId}.avatar?t=${random}`;
}

export function useAvatarUrl(userId: string) {
    const [url, setUrl] = useState(getAvatarUrl(userId))

    const refresh = useCallback(() => setUrl(getAvatarUrl(userId)), [userId])

    return { url, setUrl, refresh }
}
