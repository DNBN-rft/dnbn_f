/**
 * 공통 API 서비스
 */

const BASE_URL = "http://localhost:8080/api";

/**
 * 은행 목록 조회
 */
export const getBankList = async () => {
  try {
    const response = await fetch(`${BASE_URL}/bank`, {
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
        error: "은행 목록을 불러오는데 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("은행 목록 조회 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 카테고리 목록 조회
 */
export const getCategoryList = async () => {
  try {
    const response = await fetch(`${BASE_URL}/category`, {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      console.log("카테고리 목록 조회 응답 데이터:", data);
      return {
        success: true,
        data: data,
        error: null,
      };
    } else {
      return {
        success: false,
        data: null,
        error: "카테고리 목록을 불러오는데 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("카테고리 목록 조회 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 멤버십 플랜 목록 조회
 */
export const getMembershipList = async () => {
  try {
    const response = await fetch(`${BASE_URL}/admin/membership`, {
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
        error: "멤버십 플랜 목록을 불러오는데 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("멤버십 플랜 목록 조회 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 권한 목록 조회
 */
export const getAuthList = async () => {
  try {
    const response = await fetch(`${BASE_URL}/admin/auth`, {
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
        error: "권한 목록을 불러오는데 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("권한 목록 조회 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};