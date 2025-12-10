/**
 * 관리자 상품 관리 API 서비스
 */

const BASE_URL = "http://localhost:8080/api/admin/product";

/**
 * 모든 상품 목록 조회
 */
export const getProducts = async () => {
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
        error: "상품 목록을 불러오는데 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("상품 목록 조회 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 특정 상품 상세 조회
 * @param {string} productCode - 상품 코드
 */
export const getProductDetail = async (productCode) => {
  try {
    const response = await fetch(`${BASE_URL}/${productCode}`, {
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
        error: "상품 상세 정보를 불러오는데 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("상품 상세 조회 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 상품 정보 수정
 * @param {string} productCode - 상품 코드
 * @param {object} productData - 수정할 상품 데이터
 */
export const updateProduct = async (productCode, productData) => {
  try {
    const response = await fetch(`${BASE_URL}/${productCode}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
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
        error: "상품 정보 수정에 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("상품 정보 수정 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 상품 제재 처리
 * @param {Array<string>} productCodes - 제재할 상품 코드 목록
 */
export const restrictProducts = async (productCodes) => {
  try {
    const response = await fetch(`${BASE_URL}/restrictProduct`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productCodes }),
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
        error: "상품 제재 처리에 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("상품 제재 처리 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 상품 삭제
 * @param {Array<string>} productCodes - 삭제할 상품 코드 목록
 */
export const deleteProducts = async (productCodes) => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productCodes }),
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
        error: "상품 삭제에 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("상품 삭제 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};
