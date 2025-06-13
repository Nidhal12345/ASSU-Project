import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  role: null,
  refreshAuth: async () => {},
  logout: () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

const getDecodedJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    if (!decoded.authorities || !Array.isArray(decoded.authorities) || decoded.authorities.length === 0) {
      throw new Error("Invalid JWT: authorities missing or not an array");
    }
    return decoded;
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        const decoded = getDecodedJwt(token);
        if (decoded && decoded.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          setRole(decoded.authorities[0]);
        } else {
          localStorage.removeItem("jwtToken");
          setIsAuthenticated(false);
          setRole(null);
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const refreshAuth = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const decoded = getDecodedJwt(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setIsAuthenticated(true);
        setRole(decoded.authorities[0]);
      } else {
        localStorage.removeItem("jwtToken");
        setIsAuthenticated(false);
        setRole(null);
      }
    } else {
      setIsAuthenticated(false);
      setRole(null);
    }
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    setIsAuthenticated(false);
    setRole(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, logout, refreshAuth, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};