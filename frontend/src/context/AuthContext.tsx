import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import { authApi } from "../api/auth";
import { setAuthToken, setAuthUserId } from "../api/http";
import type { AuthUser } from "../types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_STORAGE_KEY = "collab-connect-token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_STORAGE_KEY) : null
  );
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isActive = true;

    const syncUser = async () => {
      if (!token) {
        setAuthToken(null);
        setAuthUserId(null);
        setUser(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setAuthToken(token);

      try {
        const profile = await authApi.me();
        if (isActive) {
          setAuthUserId(profile.id);
          setUser(profile);
        }
      } catch (error) {
        if (!isActive) {
          return;
        }

        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setAuthToken(null);
        setAuthUserId(null);
        setUser(null);
        setToken(null);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void syncUser();

    return () => {
      isActive = false;
    };
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    const { access_token } = await authApi.login({ email, password });
    localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
    setToken(access_token);
  }, []);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await authApi.logout();
      }
    } catch {
      // Ignore logout errors to allow client-side sign-out.
    } finally {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setAuthToken(null);
      setAuthUserId(null);
      setToken(null);
      setUser(null);
      setIsLoading(false);
    }
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isLoading,
      login,
      logout
    }),
    [user, token, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
