/**
 * 관리자 가맹점 관리 API 서비스
 */

const BASE_URL = "http://localhost:8080/api/admin/store";

/**
 * 승인 대기 가맹점 목록 조회
 */
export const getReadyStores = async () => {
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
 * 모든 가맹점 목록 조회
 */
export const getAllStores = async () => {
  try {
    const response = await fetch(`${BASE_URL}/all`, {
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
 * 가맹점 상세 조회
 */
export const getStoreDetail = async (storeCode) => {
  try {
    const response = await fetch(`${BASE_URL}/${storeCode}`, {
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
    const response = await fetch(`${BASE_URL}/${storeCode}`, {
      method: "PUT",
      credentials: "include",
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
 * 가맹점 정보 수정
 */
export const updateStoreInfo = async (storeCode, formData) => {
  try {
    const response = await fetch(`${BASE_URL}/modStoreInfo/${storeCode}`, {
      method: "PUT",
      credentials: "include",
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
export const updateSubsInfo = async (storeCode, data) => {
  try {
    const response = await fetch(`${BASE_URL}/modSubsInfo/${storeCode}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
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
export const updateMemberInfo = async (storeCode, data) => {
  try {
    const response = await fetch(`${BASE_URL}/modMemberInfo/${storeCode}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
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
export const updateBizInfo = async (storeCode, data) => {
  try {
    const response = await fetch(`${BASE_URL}/modBizInfo/${storeCode}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
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
export const updateAuthInfo = async (storeCode, data) => {
  try {
    const response = await fetch(`${BASE_URL}/modAuthInfo/${storeCode}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
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
export const updateMemberPassword = async (storeCode, data) => {
  try {
    const response = await fetch(`${BASE_URL}/modPw/${storeCode}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
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
