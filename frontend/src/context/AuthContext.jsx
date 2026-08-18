import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCurrentUser } from "../services/userService";

// 1. Create the context
const AuthContext = createContext(null);

// 2. Provider component — wrap the whole app with this
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);   // logged-in user object { _id, name, email }
  const [token, setToken]     = useState(() => localStorage.getItem("token")); // token from storage
  const [loading, setLoading] = useState(true);   // true while we verify the session on page load

  // logout: clear everything
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  // verifyUser: called on mount & after login to fetch /users/me
  const verifyUser = useCallback(async () => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      setLoading(false);
      return;
    }
    try {
      const res = await getCurrentUser();
      setUser(res.data);          // store user globally
    } catch {
      logout();                   // invalid/expired token → clear it
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // Run once on mount to rehydrate session
  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  // login: called from Login page after successful auth API call
  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    if (userData) {
      setUser(userData);          // set user immediately if backend returned it
    } else {
      verifyUser();               // otherwise fetch from /users/me
    }
  };

  // updateUser: called from Profile page after name change to update global state
  const updateUser = (partialUserData) => {
    setUser((prev) => prev ? { ...prev, ...partialUserData } : partialUserData);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated: !!token && !!user,
      login,
      logout,
      updateUser,
      refreshUser: verifyUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom hook — use this in any component
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export default AuthContext;
