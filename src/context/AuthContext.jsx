import { createContext, useState, useCallback, useEffect } from "react";
import { clearUserFromStorage } from "../utils/authService";
import { clearAdminFromStorage } from "../utils/adminAuthService";
import { apiPost } from "../utils/apiClient";

export const AuthContext = createContext();

/**
 * AuthProvider - 인증 상태 관리
 * Refresh Token은 DB에서만 관리
 * Access Token은 HttpOnly 쿠키에 저장
 * 사용자 정보는 localStorage에 저장
 */
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 토큰 유효성 확인 및 localStorage에서 사용자 정보 불러오기
  useEffect(() => {
    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 인증 상태 확인
  const checkAuthStatus = useCallback(async () => {
    try {
      // localStorage에서 사용자 정보 확인
      const storedUser = localStorage.getItem("user");
      const storedAdmin = localStorage.getItem("admin");
      
      if (storedUser) {
        setIsAuthenticated(true);
        setUser(JSON.parse(storedUser));
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }

      if (storedAdmin) {
        setIsAdminAuthenticated(true);
        setAdmin(JSON.parse(storedAdmin));
      } else {
        setIsAdminAuthenticated(false);
        setAdmin(null);
      }
    } catch (error) {
      console.error("인증 상태 확인 실패:", error);
      setIsAuthenticated(false);
      setUser(null);
      setIsAdminAuthenticated(false);
      setAdmin(null);
      clearUserFromStorage();
      clearAdminFromStorage();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 로그아웃
  const logout = useCallback(async () => {
    try {
      // 백엔드: DB의 Refresh Token 삭제
      await apiPost("/store/logout");
    } catch (error) {
      console.error("로그아웃 요청 중 오류:", error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      clearUserFromStorage(); // localStorage 정리
    }
  }, []);

  // 관리자 로그아웃
  const adminLogout = useCallback(async () => {
    try {
      // 백엔드: DB의 Refresh Token 삭제
      await apiPost("/admin/logout");
    } catch (error) {
      console.error("로그아웃 요청 중 오류:", error);
    } finally {
      setIsAdminAuthenticated(false);
      setAdmin(null);
      clearAdminFromStorage(); // localStorage 정리
    }
  }, []);

  // 로그인 성공 시 인증 상태 직접 설정
  const setAuthState = useCallback((userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setIsLoading(false);
  }, []);

  // 관리자 로그인 성공 시 인증 상태 직접 설정
  const setAdminAuthState = useCallback((adminData) => {
    setIsAdminAuthenticated(true);
    setAdmin(adminData);
    setIsLoading(false);
  }, []);

  const value = {
    isAuthenticated,
    isAdminAuthenticated,
    user,
    admin,
    isLoading,
    logout,
    adminLogout,
    checkAuthStatus,
    setAuthState,
    setAdminAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
