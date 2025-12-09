import Constants from "expo-constants";
const API_URL = Constants.expoConfig?.extra?.API_URL;

export async function getUserProfile(accessToken: string) {
    const res = await fetch(`${API_URL}/api/profile/me`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    });

    if (!res.ok) {
        throw new Error("Failed to load profile");
    }

    return res.json();
}
