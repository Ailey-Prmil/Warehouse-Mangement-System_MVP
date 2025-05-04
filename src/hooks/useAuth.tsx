"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  username: string | null;
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

// Create AuthContext with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  username: null,
  login: async () => ({ success: false, message: "Not implemented" }),
  logout: () => {},
  checkAuth: async () => false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize auth state
  useEffect(() => {
    // Only run on client-side and avoid unnecessary re-renders
    let isMounted = true;

    const initAuth = async () => {
      if (typeof window !== "undefined") {
        const result = await checkAuth();
        if (isMounted) {
          setIsLoading(false);
        }
      } else {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []);

  // Refresh access token using refresh token
  const refreshToken = async (): Promise<boolean> => {
    // Check if running in browser
    if (typeof window === "undefined") {
      return false;
    }

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      return false;
    }

    try {
      // Call the refresh API endpoint
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (data.success) {
        // Update access token in localStorage
        localStorage.setItem("accessToken", data.accessToken);
        return true;
      } else {
        // Token refresh failed, clear storage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");
        setIsAuthenticated(false);
        setUsername(null);
        return false;
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      return false;
    }
  };

  // Verify if user is authenticated
  const checkAuth = async (): Promise<boolean> => {
    // Check if running in browser
    if (typeof window === "undefined") {
      return false;
    }

    // Check for token in localStorage
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setIsAuthenticated(false);
      setUsername(null);
      return false;
    }

    try {
      // Verify token with the API
      const response = await fetch("/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setUsername(data.user.username || localStorage.getItem("username"));
        return true;
      } else {
        // Token is invalid, try to refresh it
        const refreshed = await refreshToken();

        if (refreshed) {
          // Token was refreshed successfully, try verification again
          return await checkAuth();
        } else {
          // Refresh failed, clear storage
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("username");
          setIsAuthenticated(false);
          setUsername(null);
          return false;
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
      setUsername(null);
      return false;
    }
  };

  // Login function
  const login = async (
    username: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store tokens in localStorage
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("username", username);

        setIsAuthenticated(true);
        setUsername(username);
        setIsLoading(false);

        return { success: true, message: "Authentication successful" };
      } else {
        setIsLoading(false);
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return { success: false, message: "An error occurred during login" };
    }
  };

  // Logout function
  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("username");
    }
    setIsAuthenticated(false);
    setUsername(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        username,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// HOC for protected routes
export function withAuth(Component: React.ComponentType) {
  return function WithAuth(props: any) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      // Only redirect on client-side and when not loading
      if (
        typeof window !== "undefined" &&
        !isLoading &&
        !isAuthenticated &&
        pathname !== "/login"
      ) {
        router.push("/login");
      }
    }, [isAuthenticated, isLoading, pathname, router]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
      );
    }

    if (!isAuthenticated && pathname !== "/login") {
      return null;
    }

    return <Component {...props} />;
  };
}
