/**
 * 관리자 가맹점 관리 API 서비스
 */

import { apiCall } from "./apiClient";

/**
 * 승인 대기 가맹점 목록 조회 (페이지네이션)
 */
export const getReadyStores = async (page = 0, size = 10) => {
  try {
    const response = await apiCall(`/admin/store?page=${page}&size=${size}`, {
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
        error: "승인 대기 가맹점 목록을 불러오는데 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("승인 대기 가맹점 목록 조회 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 모든 가맹점 목록 조회 (페이지네이션)
 */
export const getAllStores = async (page = 0, size = 10) => {
  try {
    const response = await apiCall(`/admin/store/all?page=${page}&size=${size}`, {
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
        error: "가맹점 목록을 불러오는데 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("가맹점 목록 조회 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 가맹점 승인 대기 상세 조회
 */
export const getPendingStoreDetail = async (storeCode) => {
  try {
    const response = await apiCall(`/admin/store/pending/${storeCode}`, {
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
        error: "가맹점 정보를 불러오는데 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("가맹점 상세 조회 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};


/**
 * 가맹점 상세 조회
 */
export const viewStoreDetail = async (storeCode) => {
  try {
    const response = await apiCall(`/admin/store/${storeCode}`, {
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
        error: "가맹점 정보를 불러오는데 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("가맹점 상세 조회 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 가맹점 승인 처리
 */
export const approveStore = async (storeCode) => {
  try {
    const response = await apiCall(`/admin/store/approve/${storeCode}`, {
      method: "PUT",
    });

    if (response.ok) {
      return {
        success: true,
        data: await response.text(),
        error: null,
      };
    } else {
      return {
        success: false,
        data: null,
        error: "가맹점 승인에 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("가맹점 승인 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};


/**
 * 가맹점 거절 처리
 */
export const rejectStore = async (storeCode) => {
  try {
    const response = await apiCall(`/admin/store/reject/${storeCode}`, {
      method: "PUT",
    });

    if (response.ok) {
      return {
        success: true,
        data: await response.text(),
        error: null,
      };
    } else {
      return {
        success: false,
        data: null,
        error: "가맹점 거절에 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("가맹점 거절 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 가맹점 정보 수정
 */
export const modStoreInfo = async (storeCode, formData) => {
  try {
    const response = await apiCall(`/admin/store/modStoreInfo/${storeCode}`, {
      method: "PUT",
      headers: {},
      body: formData, // FormData 객체
    });

    if (response.ok) {
      return {
        success: true,
        data: await response.text(),
        error: null,
      };
    } else {
      return {
        success: false,
        data: null,
        error: "가맹점 정보 수정에 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("가맹점 정보 수정 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 구독 정보 수정
 */
export const modSubsInfo = async (storeCode, subsInfo) => {
  try {
    const response = await apiCall(`/admin/store/modSubsInfo/${storeCode}`, {
      method: "PUT",
      body: JSON.stringify(subsInfo),
    });

    if (response.ok) {
      return {
        success: true,
        data: await response.text(),
        error: null,
      };
    } else {
      return {
        success: false,
        data: null,
        error: "구독 정보 수정에 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("구독 정보 수정 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 사용자 정보 수정
 */
export const modMemberInfo = async (storeCode, memberInfo) => {
  try {
    const response = await apiCall(`/admin/store/modMemberInfo/${storeCode}`, {
      method: "PUT",
      body: JSON.stringify(memberInfo),
    });

    if (response.ok) {
      return {
        success: true,
        data: await response.text(),
        error: null,
      };
    } else {
      return {
        success: false,
        data: null,
        error: "사용자 정보 수정에 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("사용자 정보 수정 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 사업자 정보 수정
 */
export const modBizInfo = async (storeCode, bizInfo) => {
  try {
    const response = await apiCall(`/admin/store/modBizInfo/${storeCode}`, {
      method: "PUT",
      body: JSON.stringify(bizInfo),
    });

    if (response.ok) {
      return {
        success: true,
        data: await response.text(),
        error: null,
      };
    } else {
      return {
        success: false,
        data: null,
        error: "사업자 정보 수정에 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("사업자 정보 수정 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 권한 정보 수정
 */
export const modAuthInfo = async (storeCode, authInfo) => {
  try {
    const response = await apiCall(`/admin/store/modAuthInfo/${storeCode}`, {
      method: "PUT",
      body: JSON.stringify(authInfo),
    });

    if (response.ok) {
      return {
        success: true,
        data: await response.text(),
        error: null,
      };
    } else {
      return {
        success: false,
        data: null,
        error: "권한 정보 수정에 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("권한 정보 수정 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 비밀번호 변경
 */
export const modMemberPassword = async (storeCode, data) => {
  try {
    const response = await apiCall(`/admin/store/modPw/${storeCode}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return {
        success: true,
        data: await response.text(),
        error: null,
      };
    } else {
      return {
        success: false,
        data: null,
        error: "비밀번호 변경에 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("비밀번호 변경 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 가맹점 검색 (페이지네이션)
 */
export const searchStores = async (searchParams, page = 0, size = 10) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...searchParams
    });

    const response = await apiCall(`/admin/store/search?${params.toString()}`, {
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
        error: "가맹점 검색에 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("가맹점 검색 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};
