/**
 * 관리자 공지사항 관리 API 서비스
 */

import { apiCall } from "./apiClient";

/**
 * 모든 공지사항 목록 조회
 */
export const getNotices = async () => {
  try {
    const response = await apiCall("/admin/notice", {
      method: "GET",
    });

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
    const response = await apiCall(`/admin/notice/${noticeIdx}`, {
      method: "GET",
    });

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
    const response = await apiCall(`/admin/notice/${noticeIdx}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

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
    const response = await apiCall("/admin/notice", {
      method: "POST",
      body: JSON.stringify(data),
    });

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
    const response = await apiCall("/admin/notice", {
      method: "DELETE",
      body: JSON.stringify({ noticeDeleteList }),
    });

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
