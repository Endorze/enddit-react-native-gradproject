import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import Constants from "expo-constants";
import { AuthContextValue } from "../types/auth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const API_URL = Constants.expoConfig?.extra?.API_URL;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    // TODO: load token from storage and set isAuthenticated
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })

    if (!res.ok) {
      throw new Error("Invalid login credentials");
    }

    const data = await res.json();
    setAccessToken(data.access_token);
    setUser(data.user);
    setIsAuthenticated(true);
  }
  const logout = () => {
    setIsAuthenticated(false);
    setAccessToken(null);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, accessToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
