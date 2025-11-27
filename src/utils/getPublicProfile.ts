import Constants from "expo-constants";
const API_URL = Constants.expoConfig?.extra?.API_URL;

export async function getPublicProfile(username: string, accessToken: string) {
    console.log("getPublicProfile: ", username)
    const res = await fetch(`${API_URL}/api/profile/by-username/${username}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    if (!res.ok) {
        throw new Error("Failed to load public profile")
    }
    return res.json();
}