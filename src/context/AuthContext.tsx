import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { AuthContextValue } from "../types/auth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const API_URL = Constants.expoConfig?.extra?.API_URL;

const REFRESH_TOKEN_KEY = "refresh_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  //if a user already has signed in, a refreshtoken should be saved in securestorage and allow user to automatically log in
  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const storedRefreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

        if (!storedRefreshToken) {
          setIsAuthenticated(false);
          setAccessToken(null);
          setUser(null);
          return;
        }

        const res = await fetch(`${API_URL}/api/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh_token: storedRefreshToken }),
        });

        if (!res.ok) {
          throw new Error("Refresh failed");
        }

        const data = await res.json();

        setAccessToken(data.access_token);
        setUser(data.user);
        setIsAuthenticated(true);

        if (data.refresh_token) {
          await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, data.refresh_token);
        }
      } catch (err) {
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        setIsAuthenticated(false);
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAuth();
  }, []);


  //login function
  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      throw new Error("Invalid login credentials");
    }

    const data = await res.json();

    setAccessToken(data.access_token);
    setUser(data.user);
    setIsAuthenticated(true);

    if (data.refresh_token) {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, data.refresh_token);
    }
  };


  //sign up function
  const signUp = async (email: string, password: string, username: string) => {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, username }),
    });

    if (!res.ok) {
      throw new Error("Invalid signup credentials");
    }

    const data = await res.json();

    setAccessToken(data.access_token);
    setUser(data.user);
    setIsAuthenticated(true);

    if (data.refresh_token) {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, data.refresh_token);
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setAccessToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        accessToken,
        user,
        login,
        logout,
        signUp,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
