import { useCallback, useState } from "react";

export function getBannerUrl(userId: string) {
    const random = new Date().valueOf();
    return `https://zjlhxbimfkzninrfzaiy.supabase.co/storage/v1/object/public/banners-enddit/${userId}.banner?t=${random}`;
}

export function useBannerUrl(userId: string) {
    const [url, setUrl] = useState(getBannerUrl(userId))

    const refresh = useCallback(() => setUrl(getBannerUrl(userId)), [userId])

    return { url, setUrl, refresh }
}
