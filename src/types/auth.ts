export type AuthContextValue = {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signUp: (email: string, password: string, username: string) => Promise<void>;
};
