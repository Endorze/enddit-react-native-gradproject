import { io } from "socket.io-client";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export function createSocket(accessToken: string) {
  return io(API_URL!, {
    auth: {
      token: accessToken,
    },
  });
}
