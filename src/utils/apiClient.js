/**
 * API 클라이언트
 * - 자동 토큰 갱신 (Token Refresh) - DB에서만 관리
 * - Access Token은 HttpOnly 쿠키에 저장
 * - 에러 처리
 */

const API_BASE_URL = "http://localhost:8080/api";

// 토큰 갱신 중인지 추적
let isRefreshing = false;
let failedQueue = [];

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
          // 프론트에서는 /api/auth/refresh 호출만 함
          const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            credentials: "include", // 쿠키의 accessToken 포함
          });

          if (refreshResponse.ok) {
            // 토큰 갱신 성공 - 원래 요청 재시도
            processQueue(null);
            response = await fetch(url, defaultOptions);
            return response;
          } else {
            // Refresh Token도 만료됨 - 로그인 페이지로 리다이렉트
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

export default {
  apiCall,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  apiPostFormData,
  apiPutFormData,
};
