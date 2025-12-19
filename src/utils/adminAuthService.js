/**
 * 관리자 로그인 처리 서비스
 */

import { apiCall } from "./apiClient";
import apiClient from "./apiClient";

/**
 * 관리자 로그인 API 호출 및 localStorage에 사용자 정보 저장
 * @param {string} empId - 관리자 아이디
 * @param {string} password - 관리자 비밀번호
 * @returns {Promise<Object>} - 로그인 결과 { success: boolean, data: Object, error: string }
 */
export const adminLogin = async (empId, password) => {
  try {
    const response = await apiCall("/admin/login", {
      method: "POST",
      body: JSON.stringify({
        empId: empId,
        empPw: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.clear();
      
      // localStorage에 관리자 정보 저장
      const admin = {
        empId: data.memberId,
        empNm: data.memberNm,
      };
      localStorage.setItem("admin", JSON.stringify(admin));

      // 로그인 성공 시 주기적 토큰 갱신 시작
      apiClient.startTokenRefresh();

      return {
        success: true,
        data: admin,
        error: null,
      };
    } else {
      const errorText = await response.text();
      let errorMessage = "로그인에 실패했습니다.";
      
      if (response.status === 401) {
        errorMessage = "아이디 또는 비밀번호가 잘못되었습니다.";
      } else if (errorText) {
        errorMessage = errorText;
      }

      return {
        success: false,
        data: null,
        error: errorMessage,
      };
    }
  } catch (error) {
    console.error("로그인 중 오류 발생:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
    };
  }
};

/**
 * localStorage에서 관리자 정보 가져오기
 * @returns {Object|null} - 관리자 정보 또는 null
 */
export const getAdminFromStorage = () => {
  try {
    const adminStr = localStorage.getItem("admin");
    return adminStr ? JSON.parse(adminStr) : null;
  } catch (error) {
    console.error("관리자 정보 읽기 실패:", error);
    return null;
  }
};

/**
 * localStorage에서 관리자 정보 삭제
 */
export const clearAdminFromStorage = () => {
  localStorage.removeItem("admin");
  // 로그아웃 시 토큰 자동 갱신 중지
  apiClient.stopTokenRefresh();
};

// 권한 목록 조회
export const getAuthList = async () => {
  try {
    const response = await apiCall("/admin/auth", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("권한 목록 조회 실패");
    }

    const data = await response.json();
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("권한 목록 조회 에러:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};