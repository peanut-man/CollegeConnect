import { startTransition, useEffect, useState } from "react";
import { AuthContext } from "./auth-context";
import api from "../services/api";

function clearLegacyToken() {
  try {
    localStorage.removeItem("college-connect-token");
  } catch {
    // Ignore localStorage failures and continue with cookie auth.
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    clearLegacyToken();
  }, []);

  useEffect(() => {
    let active = true;

    async function bootstrapAuth() {
      try {
        const response = await api.get("/auth/me");
        if (!active) {
          return;
        }
        startTransition(() => {
          setUser(response.data.user ?? null);
        });
      } catch {
        if (!active) {
          return;
        }
        startTransition(() => {
          setUser(null);
        });
      } finally {
        if (active) {
          setLoading(false);
          setAuthReady(true);
        }
      }
    }

    bootstrapAuth();

    return () => {
      active = false;
    };
  }, []);

  async function refreshUser() {
    const response = await api.get("/auth/me");
    const nextUser = response.data.user ?? null;
    setUser(nextUser);
    return nextUser;
  }

  async function login(credentials) {
    const response = await api.post("/auth/login", credentials);
    const nextUser = response.data.user ?? (await refreshUser());
    setUser(nextUser);
    return nextUser;
  }

  async function signup(formData) {
    const response = await api.post("/auth/signup", formData);
    const nextUser = response.data.user ?? (await refreshUser());
    setUser(nextUser);
    return nextUser;
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        authReady,
        loading,
        login,
        logout,
        refreshUser,
        signup,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
