/**
 * 공통 API 서비스
 */

import { apiGet } from "./apiClient";


/**
 * 은행 목록 조회
 */
export const getBankList = async () => {
  try {
    const response = await apiGet(`/bank`);

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        data: data,
        error: null,
      };
    } else {
      return {
        success: false,
        data: null,
        error: "은행 목록을 불러오는데 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("은행 목록 조회 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 카테고리 목록 조회
 */
export const getCategoryList = async () => {
  try {
    const response = await apiGet(`/category`);

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        data: data,
        error: null,
      };
    } else {
      return {
        success: false,
        data: null,
        error: "카테고리 목록을 불러오는데 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("카테고리 목록 조회 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 멤버십 플랜 목록 조회
 */
export const getMembershipList = async () => {
  try {
    const response = await apiGet(`/admin/membership`);

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        data: data,
        error: null,
      };
    } else {
      return {
        success: false,
        data: null,
        error: "멤버십 플랜 목록을 불러오는데 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("멤버십 플랜 목록 조회 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 권한 목록 조회
 */
export const getAuthList = async () => {
  try {
    const response = await apiGet(`/admin/auth`);

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        data: data,
        error: null,
      };
    } else {
      return {
        success: false,
        data: null,
        error: "권한 목록을 불러오는데 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("권한 목록 조회 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 날짜 및 시간 포맷팅
 * @param {string|Date} dateTime - 포맷팅할 날짜/시간
 * @returns {string} 포맷팅된 날짜/시간 문자열 (YYYY. MM. DD HH:MM)
 */
export const formatDateTime = (dateTime) => {
  if (!dateTime) return "-";
  const date = new Date(dateTime);
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDate = (dateTime) => {
  if (!dateTime) return "-";
  const date = new Date(dateTime);
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const formatDateToInput = (dateTime) => {
  if (!dateTime) return "";
  const date = new Date(dateTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};