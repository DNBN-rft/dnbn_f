/**
 * 관리자 상품 관리 API 서비스
 */

import { apiDelete, apiGet, apiPut } from "./apiClient";

/**
 * 모든 상품 목록 조회 (페이지네이션)
 * @param {number} page - 페이지 번호 (0부터 시작)
 * @param {number} size - 페이지 크기
 */
export const getProducts = async (page = 0, size = 10) => {
  try {
    const response = await apiGet(`/admin/product?page=${page}&size=${size}`);

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
    const response = await apiGet(`/admin/product/${productCode}`);

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
    const response = await apiPut(`/admin/product/${productCode}`, JSON.stringify(productData));

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
    const response = await apiPut(`/admin/product/restrictProduct`, JSON.stringify({ productCodes }));

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
    const response = await apiDelete(`/admin/product`, JSON.stringify({ productCodes }));

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

/**
 * 상품 검색 (페이지네이션)
 * @param {object} searchParams - 검색 파라미터
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 */
export const searchProducts = async (searchParams, page = 0, size = 10) => {
  try {
    const params = new URLSearchParams();
    
    if (searchParams.startDate) params.append("startDate", searchParams.startDate);
    if (searchParams.endDate) params.append("endDate", searchParams.endDate);
    if (searchParams.categoryNm && searchParams.categoryNm !== "all-category") {
      params.append("categoryNm", searchParams.categoryNm);
    }
    if (searchParams.productState && searchParams.productState !== "all") {
      params.append("productState", searchParams.productState);
    }
    if (searchParams.searchTerm) {
      params.append("searchTerm", searchParams.searchTerm);
      params.append("searchType", searchParams.searchType || "all");
    }
    params.append("page", page);
    params.append("size", size);

    const response = await apiGet(`/admin/product/search?${params.toString()}`);

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
        error: "상품 검색에 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("상품 검색 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};
