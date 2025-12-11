import { createContext, useState, useCallback, useEffect } from "react";
import { getUserFromStorage, clearUserFromStorage } from "../utils/authService";

export const AuthContext = createContext();

/**
 * AuthProvider - 인증 상태 관리
 * Refresh Token은 DB에서만 관리
 * Access Token은 HttpOnly 쿠키에 저장
 * 사용자 정보는 localStorage에 저장
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 localStorage에서 사용자 정보 복원
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("사용자 정보 복원 실패:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // 인증 상태 확인 (필요시 토큰 갱신용)
  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        return true;
      } else {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("user");
        return false;
      }
    } catch (error) {
      console.error("인증 상태 확인 실패:", error);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("user");
      return false;
    }
  }, []);

  // 로그아웃
  const logout = useCallback(async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("로그아웃 요청 중 오류:", error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("user");
    }
  }, []);

  // Access Token 갱신
  // Refresh Token은 DB에서 자동으로 처리됨
  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/refresh", {
        method: "POST",
        credentials: "include", // 쿠키의 Access Token 포함
      });

      if (response.ok) {
        return true;
      } else {
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error("토큰 갱신 실패:", error);
      return false;
    }
  }, []);

  // 로그인 성공 시 인증 상태 직접 설정
  const setAuthState = useCallback((userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setIsLoading(false);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  const value = {
    isAuthenticated,
    user,
    isLoading,
    logout,
    refreshAccessToken,
    checkAuthStatus,
    setAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
