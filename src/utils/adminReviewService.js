/**
 * 관리자 리뷰 관리 API 서비스
 */

const BASE_URL = "http://localhost:8080/admin/api/review";

/**
 * 모든 리뷰 목록 조회
 */
export const getReviews = async () => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "GET",
      credentials: "include",
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
        error: "리뷰 목록을 불러오는데 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("리뷰 목록 조회 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 특정 리뷰 상세 조회
 * @param {number} reviewIdx - 리뷰 인덱스
 */
export const getReviewDetail = async (reviewIdx) => {
  try {
    const response = await fetch(`${BASE_URL}/${reviewIdx}`, {
      method: "GET",
      credentials: "include",
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
        error: "리뷰 상세 정보를 불러오는데 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("리뷰 상세 조회 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 리뷰 숨김 처리
 * @param {number} reviewIdx - 리뷰 인덱스
 */
export const hideReview = async (reviewIdx) => {
  try {
    const response = await fetch(`${BASE_URL}/hidden/${reviewIdx}`, {
      method: "PUT",
      credentials: "include",
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
        error: "리뷰 숨김 처리에 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("리뷰 숨김 처리 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 리뷰 숨김 해제
 * @param {number} reviewIdx - 리뷰 인덱스
 */
export const unhideReview = async (reviewIdx) => {
  try {
    const response = await fetch(`${BASE_URL}/unhide/${reviewIdx}`, {
      method: "PUT",
      credentials: "include",
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
        error: "리뷰 숨김 해제에 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("리뷰 숨김 해제 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 리뷰 삭제
 * @param {Array<number>} reviewDeleteList - 삭제할 리뷰 인덱스 목록
 */
export const deleteReviews = async (reviewDeleteList) => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reviewDeleteList }),
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
        error: "리뷰 삭제에 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("리뷰 삭제 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 리뷰 숨김 만료 시간 수정
 * @param {number} reviewIdx - 리뷰 인덱스
 * @param {string} newHiddenDate - 새로운 만료 날짜 (YYYY-MM-DD)
 */
export const updateHiddenExpiry = async (reviewIdx, newHiddenDate) => {
  try {
    const response = await fetch(`${BASE_URL}/${reviewIdx}/hidden-expiry`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newHiddenDate }),
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
        error: "숨김 만료 시간 수정에 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("숨김 만료 시간 수정 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};
