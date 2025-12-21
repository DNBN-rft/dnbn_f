/**
 * 관리자 리뷰 관리 API 서비스
 */

const BASE_URL = "http://localhost:8080/api/admin/review";

/**
 * 모든 리뷰 목록 조회 (페이지네이션)
 * @param {number} page - 페이지 번호 (0부터 시작)
 * @param {number} size - 페이지 크기
 */
export const getReviews = async (page = 0, size = 10) => {
  try {
    const response = await fetch(`${BASE_URL}?page=${page}&size=${size}`, {
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

/**
 * 리뷰 검색 (페이지네이션)
 * @param {object} searchParams - 검색 조건
 * @param {number} page - 페이지 번호 (0부터 시작)
 * @param {number} size - 페이지 크기
 */
export const searchReviews = async (searchParams, page = 0, size = 10) => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', size);
    
    if (searchParams.isHidden !== undefined && searchParams.isHidden !== null) {
      params.append('isHidden', searchParams.isHidden);
    }
    if (searchParams.startDate) {
      params.append('startDate', searchParams.startDate);
    }
    if (searchParams.endDate) {
      params.append('endDate', searchParams.endDate);
    }
    if (searchParams.ratings && searchParams.ratings.length > 0) {
      searchParams.ratings.forEach(rating => params.append('ratings', rating));
    }
    if (searchParams.searchTerm) {
      params.append('searchTerm', searchParams.searchTerm);
    }
    if (searchParams.searchType) {
      params.append('searchType', searchParams.searchType);
    }

    const response = await fetch(`${BASE_URL}/search?${params.toString()}`, {
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
        error: "리뷰 검색에 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("리뷰 검색 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 신고된 리뷰 목록 조회 (페이지네이션)
 * @param {number} page - 페이지 번호 (0부터 시작)
 * @param {number} size - 페이지 크기
 */
export const getReportedReviews = async (page = 0, size = 10) => {
  try {
    const response = await fetch(`${BASE_URL}/reportedReview?page=${page}&size=${size}`, {
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
        error: "신고 리뷰 목록을 불러오는데 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("신고 리뷰 목록 조회 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};
