import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export const sendFriendRequest = async ({ to_user_id, accessToken }: { to_user_id: string, accessToken: string | null }) => {

    const res = await fetch(`${API_URL}/api/profile/addfriend/${to_user_id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    })

    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error("Error adding comment");
    }
    return res.json();
};
