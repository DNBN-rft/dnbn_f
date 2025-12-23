/**
 * 관리자 공지사항 관리 API 서비스
 */

import { apiDelete, apiGet, apiPost, apiPut } from "./apiClient";

/**
 * 모든 공지사항 목록 조회 (페이지네이션)
 * @param {number} page - 페이지 번호 (0부터 시작)
 * @param {number} size - 페이지 크기
 */
export const getNotices = async (page = 0, size = 10) => {
  try {
    const response = await apiGet(`/admin/notice?page=${page}&size=${size}`);

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
        error: "공지사항 목록을 불러오는데 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("공지사항 목록 조회 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 특정 공지사항 상세 조회
 * @param {number} noticeIdx - 공지사항 인덱스
 */
export const getNoticeDetail = async (noticeIdx) => {
  try {
    const response = await apiGet(`/admin/notice/${noticeIdx}`);

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
        error: "공지사항 상세 정보를 불러오는데 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("공지사항 상세 조회 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 공지사항 수정
 * @param {number} noticeIdx - 공지사항 인덱스
 * @param {Object} data - 수정할 데이터 { title, content, isPinned }
 */
export const updateNotice = async (noticeIdx, data) => {
  try {
    const response = await apiPut(`/admin/notice/${noticeIdx}`, JSON.stringify(data));

    if (response.ok) {
      const message = await response.text();
      return {
        success: true,
        data: message,
        error: null,
      };
    } else {
      return {
        success: false,
        data: null,
        error: "공지사항 수정에 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("공지사항 수정 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 공지사항 등록
 * @param {Object} data - 등록할 데이터 { title, content, isPinned }
 */
export const createNotice = async (data) => {
  try {
    const response = await apiPost("/admin/notice", JSON.stringify(data));

    if (response.ok) {
      const message = await response.text();
      return {
        success: true,
        data: message,
        error: null,
      };
    } else {
      return {
        success: false,
        data: null,
        error: "공지사항 등록에 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("공지사항 등록 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 공지사항 삭제
 * @param {Array<number>} noticeDeleteList - 삭제할 공지사항 인덱스 목록
 */
export const deleteNotices = async (noticeDeleteList) => {
  try {
    const response = await apiDelete("/admin/notice", JSON.stringify({ noticeDeleteList }));

    if (response.ok) {
      const message = await response.text();
      return {
        success: true,
        data: message,
        error: null,
      };
    } else {
      return {
        success: false,
        data: null,
        error: "공지사항 삭제에 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("공지사항 삭제 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 공지사항 검색 (페이지네이션)
 * @param {object} searchParams - 검색 조건
 * @param {number} page - 페이지 번호 (0부터 시작)
 * @param {number} size - 페이지 크기
 */
export const searchNotices = async (searchParams, page = 0, size = 10) => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', size);
    
    if (searchParams.isPinned !== undefined && searchParams.isPinned !== null) {
      params.append('isPinned', searchParams.isPinned);
    }
    if (searchParams.startDate) {
      params.append('startDate', searchParams.startDate);
    }
    if (searchParams.endDate) {
      params.append('endDate', searchParams.endDate);
    }
    if (searchParams.searchTerm) {
      params.append('searchTerm', searchParams.searchTerm);
    }
    if (searchParams.searchType) {
      params.append('searchType', searchParams.searchType);
    }

    const response = await apiGet(`/admin/notice/search?${params.toString()}`);

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
        error: "공지사항 검색에 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("공지사항 검색 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};
