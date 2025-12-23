import { apiGet, apiPut } from "./apiClient";

/**
 * 알림 관련 API 서비스
 */

/**
 * 사용자의 알림 목록을 조회합니다
 * @param {number} memberId - 회원 ID
 * @returns {Promise<Array>} 알림 목록
 */
export const fetchAlarmList = async (memberId) => {
  if (!memberId) {
    throw new Error("memberId가 필요합니다.");
  }

  const response = await apiGet(`/store/alarm/list?memberId=${memberId}`);

  if (!response.ok) {
    throw new Error("알림 목록을 불러오는데 실패했습니다.");
  }

  const data = await response.json();
  return data;
};

/**
 * 읽지 않은 알림 개수를 조회합니다
 * @param {number} memberId - 회원 ID
 * @returns {Promise<number>} 읽지 않은 알림 개수
 */
export const fetchUnreadAlarmCount = async (memberId) => {
  if (!memberId) {
    throw new Error("memberId가 필요합니다.");
  }

  const response = await apiGet(`/store/alarm/unread-count?memberId=${memberId}`);

  if (!response.ok) {
    throw new Error("읽지 않은 알림 개수를 불러오는데 실패했습니다.");
  }

  const data = await response.json();
  return data.count || 0;
};

/**
 * 알림을 읽음 처리합니다 (alarmIdx 사용)
 * @param {number} alarmIdx - 알림 인덱스
 * @returns {Promise<void>}
 */
export const markAlarmAsRead = async (alarmIdx) => {
  if (!alarmIdx) {
    throw new Error("alarmIdx가 필요합니다.");
  }

  const response = await apiPut(`/store/alarm/read?storeAlarmIdx=${alarmIdx}`);

  if (!response.ok) {
    throw new Error("알림을 읽음 처리하는데 실패했습니다.");
  }
};

/**
 * 모든 알림을 읽음 처리합니다
 * @param {number} memberId - 회원 ID
 * @returns {Promise<void>}
 */
export const markAllAlarmsAsRead = async (memberId) => {
  if (!memberId) {
    throw new Error("memberId가 필요합니다.");
  }

  const response = await apiPut(`/store/alarm/read-all?memberId=${memberId}`);

  if (!response.ok) {
    throw new Error("모든 알림을 읽음 처리하는데 실패했습니다.");
  }
};

/**
 * 관리자 가맹점 알림 목록 조회 (페이지네이션)
 * @param {number} page - 페이지 번호 (0부터 시작)
 * @param {number} size - 페이지 크기
 * @returns {Promise<Object>} 페이지네이션된 알림 목록
 */
export const getAdminStoreAlarms = async (page = 0, size = 10) => {
  const response = await apiGet(`/admin/alarm/store?page=${page}&size=${size}`);

  if (!response.ok) {
    throw new Error("알림 목록을 불러오는데 실패했습니다.");
  }

  return await response.json();
};

/**
 * 관리자 스토어 알람 검색 (페이지네이션)
 * @param {object} searchParams - 검색 조건
 * @param {number} page - 페이지 번호 (0부터 시작)
 * @param {number} size - 페이지 크기
 */
export const searchAlrams = async (searchParams, page = 0, size = 10) => {
  try {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("size", size);

    if (searchParams.startDate) {
      params.append("startDate", searchParams.startDate);
    }
    if (searchParams.endDate) {
      params.append("endDate", searchParams.endDate);
    }
    if (searchParams.alarmType && searchParams.alarmType !== "all") {
      params.append("alarmType", searchParams.alarmType);
    }
    if (searchParams.searchType) {
      params.append("searchType", searchParams.searchType);
    }
    if (searchParams.searchTerm) {
      params.append("searchTerm", searchParams.searchTerm);
    }

    const response = await apiGet(`/admin/alarm/search-store?${params.toString()}`);

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
        error: "알람 검색에 실패했습니다.",
      };
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};
