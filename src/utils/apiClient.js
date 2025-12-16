const API_BASE_URL = "http://localhost:8080/api";
// 토큰 갱신 중인지 추적
let isRefreshing = false;
let failedQueue = [];
// 주기적 토큰 갱신 (Access Token 만료 전 자동 갱신)
let refreshInterval = null;
// 현재 로그인 타입 확인 (store 또는 admin)
const getLoginType = () => {
  const user = localStorage.getItem("user");
  const admin = localStorage.getItem("admin");
  if (admin) return "admin";
  if (user) return "store";
  return null;
};
// 로그인 타입에 따른 refresh endpoint 반환
const getRefreshEndpoint = () => {
  const loginType = getLoginType();
  if (loginType === "admin") return "/admin/refresh";
  return "/store/refresh";
};
// 로그인 타입에 따른 로그인 페이지 반환
const getLoginPage = () => {
  const loginType = getLoginType();
  if (loginType === "admin") return "/admin/login";
  return "/store/login";
};
// Access Token 만료 전 자동 갱신 (10분마다 체크)
const startTokenRefresh = () => {
  if (refreshInterval) return; // 이미 실행 중이면 중복 실행 방지
  refreshInterval = setInterval(async () => {
    try {
      const refreshEndpoint = getRefreshEndpoint();
      const response = await fetch(`${API_BASE_URL}${refreshEndpoint}`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        // Refresh Token도 만료되면 로그인 페이지로
        stopTokenRefresh();
        window.location.href = getLoginPage();
      }
    } catch (error) {
      console.error("주기적 토큰 갱신 실패:", error);
    }
  }, 600000); // 10분마다 갱신 (access token 15분, refresh token 7일)
};
// 토큰 갱신 중지
const stopTokenRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  isRefreshing = false;
  failedQueue = [];
};
/**
 * API 요청 래퍼 함수
 * Access Token은 쿠키에서 자동 포함
 * Refresh Token은 DB에서만 관리
 */
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Access Token 쿠키 자동 포함
    ...options,
  };
  try {
    let response = await fetch(url, defaultOptions);
    // Access Token 만료 (401) 응답 처리
    if (response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // Refresh Token은 백엔드 DB에서 관리
          // 로그인 타입에 따라 적절한 refresh endpoint 호출
          const refreshEndpoint = getRefreshEndpoint();
          const refreshResponse = await fetch(`${API_BASE_URL}${refreshEndpoint}`, {
            method: "POST",
            credentials: "include", // 쿠키의 refreshToken 포함
          });
          if (refreshResponse.ok) {
            // 토큰 갱신 성공 - 원래 요청 재시도
            processQueue(null);
            response = await fetch(url, defaultOptions);
            return response;
          } else {
            // Refresh Token도 만료됨 - 로그인 페이지로 리다이렉트
            processQueue(new Error("Token refresh failed"));
            window.location.href = getLoginPage();
            return response;
          }
        } catch (error) {
          processQueue(error);
          window.location.href = "/store/login";
          throw error;
        }
      } else {
        // 이미 갱신 중인 경우 대기
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => fetch(url, defaultOptions));
      }
    }
    return response;
  } catch (error) {
    console.error("API 요청 실패:", error);
    throw error;
  }
};
/**
 * GET 요청
 */
export const apiGet = async (endpoint, options = {}) => {
  return apiCall(endpoint, {
    ...options,
    method: "GET",
  });
};
/**
 * POST 요청
 */
export const apiPost = async (endpoint, data = null, options = {}) => {
  return apiCall(endpoint, {
    ...options,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
};
/**
 * PUT 요청
 */
export const apiPut = async (endpoint, data = null, options = {}) => {
  return apiCall(endpoint, {
    ...options,
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
};
/**
 * DELETE 요청
 */
export const apiDelete = async (endpoint, options = {}) => {
  return apiCall(endpoint, {
    ...options,
    method: "DELETE",
  });
};
/**
 * FormData를 사용한 POST 요청 (파일 업로드 등)
 */
export const apiPostFormData = async (endpoint, formData, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    let response = await fetch(url, {
      method: "POST",
      credentials: "include", // 쿠키 자동 포함
      body: formData,
      ...options,
    });
    // Access Token 만료 처리
    if (response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
          });
          if (refreshResponse.ok) {
            processQueue(null);
            response = await fetch(url, {
              method: "POST",
              credentials: "include",
              body: formData,
            });
            return response;
          } else {
            processQueue(new Error("Token refresh failed"));
            window.location.href = "/store/login";
            return response;
          }
        } catch (error) {
          processQueue(error);
          window.location.href = "/store/login";
          throw error;
        }
      } else {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() =>
          fetch(url, {
            method: "POST",
            credentials: "include",
            body: formData,
          })
        );
      }
    }
    return response;
  } catch (error) {
    console.error("FormData API 요청 실패:", error);
    throw error;
  }
};
/**
 * FormData를 사용한 PUT 요청 (파일 업로드 등)
 */
export const apiPutFormData = async (endpoint, formData, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    let response = await fetch(url, {
      method: "PUT",
      credentials: "include", // 쿠키 자동 포함
      body: formData,
      ...options,
    });
    // Access Token 만료 처리
    if (response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
          });
          if (refreshResponse.ok) {
            processQueue(null);
            response = await fetch(url, {
              method: "PUT",
              credentials: "include",
              body: formData,
            });
            return response;
          } else {
            processQueue(new Error("Token refresh failed"));
            window.location.href = "/store/login";
            return response;
          }
        } catch (error) {
          processQueue(error);
          window.location.href = "/store/login";
          throw error;
        }
      } else {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() =>
          fetch(url, {
            method: "PUT",
            credentials: "include",
            body: formData,
          })
        );
      }
    }
    return response;
  } catch (error) {
    console.error("FormData API 요청 실패:", error);
    throw error;
  }
};
const apiClient = {
  apiCall,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  apiPostFormData,
  apiPutFormData,
  startTokenRefresh,
  stopTokenRefresh,
};
export default apiClient;