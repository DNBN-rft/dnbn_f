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

// 현재 날짜를 YYYY-MM-DD 형식으로 반환
export const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 현재 시간 + 지정된 분을 HH:MM 형식으로 반환 (30분 단위로 올림)
export const getCurrentTimePlusMinutes = (addMinutes = 5) => {
  const now = new Date();
  const futureTime = new Date(now.getTime() + addMinutes * 60 * 1000);
  
  // 30분 단위로 올림 (현재 시간보다 나중 시간)
  const minutes = futureTime.getMinutes();
  const roundedMinutes = minutes < 30 ? 30 : 60;
  
  futureTime.setMinutes(roundedMinutes);
  futureTime.setSeconds(0);
  futureTime.setMilliseconds(0);
  
  const hours = String(futureTime.getHours()).padStart(2, '0');
  const mins = String(futureTime.getMinutes()).padStart(2, '0');
  return `${hours}:${mins}`;
};

// 시작 날짜/시간으로부터 지정된 시간 후의 종료 일시를 포맷팅
export const calculateEndDateTime = (startDate, startTime, durationHours) => {
  if (!startDate || !startTime) return "";
  
  const start = new Date(`${startDate}T${startTime}`);
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
  
  const year = end.getFullYear();
  const month = String(end.getMonth() + 1).padStart(2, '0');
  const day = String(end.getDate()).padStart(2, '0');
  const hours = end.getHours();
  const minutes = String(end.getMinutes()).padStart(2, '0');
  const period = hours >= 12 ? '오후' : '오전';
  const displayHours = hours % 12 || 12;
  
  return `${year}-${month}-${day} ${period} ${displayHours}:${minutes}`;
};

/**
 * 시간 문자열을 Date 객체로 변환 (HH:MM -> Date)
 * @param {string} timeString - 변환할 시간 문자열 (HH:MM)
 * @returns {Date|null} Date 객체 또는 null
 */
export const parseTimeToDate = (timeString) => {
  if (!timeString) return null;
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

/**
 * Date 객체를 시간 문자열로 변환 (Date -> HH:MM)
 * @param {Date} date - 변환할 Date 객체
 * @returns {string} 시간 문자열 (HH:MM)
 */
export const formatTimeToString = (date) => {
  if (!date) return "";
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

// 현재 시간 + 지정된 분으로부터 지속시간 후의 종료 일시를 포맷팅 (30분 단위 올림 적용)
export const calculateInitialEndDateTime = (addMinutes = 5, durationHours = 24) => {
  const now = new Date();
  const futureTime = new Date(now.getTime() + addMinutes * 60 * 1000);
  
  // 30분 단위로 올림 (getCurrentTimePlusMinutes와 동일한 로직)
  const currentMinutes = futureTime.getMinutes();
  const roundedMinutes = currentMinutes < 30 ? 30 : 60;
  futureTime.setMinutes(roundedMinutes);
  futureTime.setSeconds(0);
  futureTime.setMilliseconds(0);
  
  // 올림된 시작 시간으로부터 종료 시간 계산
  const end = new Date(futureTime.getTime() + durationHours * 60 * 60 * 1000);
  
  const year = end.getFullYear();
  const month = String(end.getMonth() + 1).padStart(2, '0');
  const day = String(end.getDate()).padStart(2, '0');
  const hours = end.getHours();
  const minutes = String(end.getMinutes()).padStart(2, '0');
  const period = hours >= 12 ? '오후' : '오전';
  const displayHours = hours % 12 || 12;
  
  return `${year}-${month}-${day} ${period} ${displayHours}:${minutes}`;
};