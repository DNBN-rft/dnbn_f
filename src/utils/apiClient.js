const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://dnbn-x5or.onrender.com/api';
//const API_BASE_URL = "http://localhost:8080/api";

// 토큰 갱신 중인지 추적
let isRefreshing = false;
let failedQueue = [];
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

// 토큰 만료 시 공통 처리
const handleTokenExpired = () => {
  localStorage.clear();
  window.location.href = getLoginPage();
};

// 대기 중인 요청 처리
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

// 401 응답 처리 (공통)
const handle401Response = async (url, options) => {
  if (!isRefreshing) {
    isRefreshing = true;
    try {
      const refreshEndpoint = getRefreshEndpoint();
      const refreshResponse = await fetch(`${API_BASE_URL}${refreshEndpoint}`, {
        method: "POST",
        credentials: "include",
      });

      if (refreshResponse.ok) {
        processQueue(null);
        return fetch(url, options);
      } else {
        processQueue(new Error("Token refresh failed"));
        isRefreshing = false;
        handleTokenExpired();
        return refreshResponse;
      }
    } catch (error) {
      processQueue(error);
      isRefreshing = false;
      handleTokenExpired();
      throw error;
    }
  } else {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then(() => fetch(url, options));
  }
};

// Access Token 만료 전 자동 갱신 (45초마다 체크)
const startTokenRefresh = () => {
  if (refreshInterval) return;
  refreshInterval = setInterval(async () => {
    try {
      const refreshEndpoint = getRefreshEndpoint();
      const response = await fetch(`${API_BASE_URL}${refreshEndpoint}`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        console.log("토큰 갱신 성공");
      } else {
        console.error("토큰 갱신 실패 - 로그아웃 처리");
        stopTokenRefresh();
        handleTokenExpired();
      }
    } catch (error) {
      console.error("주기적 토큰 갱신 중 오류:", error);
    }
  }, 45000); // 45초마다 갱신 (access token 1분, refresh token 5분)
};

// 토큰 갱신 중지
const stopTokenRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
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
    credentials: "include",
    ...options,
  };

  try {
    let response = await fetch(url, defaultOptions);

    if (response.status === 401) {
      response = await handle401Response(url, defaultOptions);
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
 * FormData를 사용한 API 요청 (파일 업로드 등)
 */
const apiFormDataCall = async (endpoint, formData, method, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    let response = await fetch(url, {
      method,
      credentials: "include",
      body: formData,
      ...options,
    });

    if (response.status === 401) {
      response = await handle401Response(url, {
        method,
        credentials: "include",
        body: formData,
        ...options,
      });
    }

    return response;
  } catch (error) {
    console.error("FormData API 요청 실패:", error);
    throw error;
  }
};

/**
 * FormData를 사용한 POST 요청 (파일 업로드 등)
 */
export const apiPostFormData = async (endpoint, formData, options = {}) => {
  return apiFormDataCall(endpoint, formData, "POST", options);
};

/**
 * FormData를 사용한 PUT 요청 (파일 업로드 등)
 */
export const apiPutFormData = async (endpoint, formData, options = {}) => {
  return apiFormDataCall(endpoint, formData, "PUT", options);
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
