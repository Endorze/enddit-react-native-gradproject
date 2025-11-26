import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export const addComment = async ({ postId, newComment, accessToken }: { postId: number, newComment: string, accessToken: string | null }) => {

    const res = await fetch(`${API_URL}/api/posts/${postId}/addcomment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            content: newComment,
        })
    })

    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error("Error adding comment");
    }
    return res.json();
};
