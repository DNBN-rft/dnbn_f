/**
 * 관리자 지역 통계 API 서비스
 */

import { apiGet } from "./apiClient";

/**
 * 지역별 월별 판매 통계 조회
 * @param {string} addr - 구/군 주소
 * @returns {Promise} 월별 판매 데이터
 */
export const getRegionStatistics = async (addr) => {
  try {
    const response = await apiGet(`/admin/stat/store?addr=${encodeURIComponent(addr)}`);

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
        error: "지역 통계 조회 실패",
      };
    }
  } catch (error) {
    console.error("지역 통계 조회 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};
