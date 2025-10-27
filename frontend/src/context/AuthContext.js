import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/auth";
import { setAuthToken, setAuthUserId } from "../api/http";
const AuthContext = createContext(undefined);
const TOKEN_STORAGE_KEY = "collab-connect-token";
export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => typeof window !== "undefined" ? localStorage.getItem(TOKEN_STORAGE_KEY) : null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
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
            }
            catch (error) {
                if (!isActive) {
                    return;
                }
                localStorage.removeItem(TOKEN_STORAGE_KEY);
                setAuthToken(null);
                setAuthUserId(null);
                setUser(null);
                setToken(null);
            }
            finally {
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
    const login = useCallback(async (email, password) => {
        const { access_token } = await authApi.login({ email, password });
        localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
        setToken(access_token);
    }, []);
    const logout = useCallback(async () => {
        try {
            if (token) {
                await authApi.logout();
            }
        }
        catch {
            // Ignore logout errors to allow client-side sign-out.
        }
        finally {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            setAuthToken(null);
            setAuthUserId(null);
            setToken(null);
            setUser(null);
            setIsLoading(false);
        }
    }, [token]);
    const value = useMemo(() => ({
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isLoading,
        login,
        logout
    }), [user, token, isLoading, login, logout]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
