import { apiCall } from "./apiClient";

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

  const response = await apiCall(`/store/alarm/list?memberId=${memberId}`, {
    method: "GET",
  });

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

  const response = await apiCall(`/store/alarm/unread-count?memberId=${memberId}`, {
    method: "GET",
  });

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

  const response = await apiCall(`/store/alarm/read?storeAlarmIdx=${alarmIdx}`, {
    method: "PUT",
  });

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

  const response = await apiCall(`/store/alarm/read-all?memberId=${memberId}`, {
    method: "PUT",
  });

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
  const response = await apiCall(`/admin/alarm/store?page=${page}&size=${size}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("알림 목록을 불러오는데 실패했습니다.");
  }

  return await response.json();
};
