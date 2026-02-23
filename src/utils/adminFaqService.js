/**
 * 관리자 FAQ 관리 API 서비스
 */

import { apiDelete, apiGet, apiPost, apiPut } from "./apiClient";

/**
 * 모든 FAQ 목록 조회 (페이지네이션)
 * @param {number} page - 페이지 번호 (0부터 시작)
 * @param {number} size - 페이지 크기
 */
export const getFaqList = async (page = 0, size = 10) => {
  try {
    const response = await apiGet(`/admin/faq?page=${page}&size=${size}`);

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
        error: "FAQ 목록을 불러오는데 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("FAQ 목록 조회 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * 특정 FAQ 상세 조회
 * @param {number} faqIdx - FAQ 인덱스
 */
export const getFaqDetail = async (faqIdx) => {
  try {
    const response = await apiGet(`/admin/faq/${faqIdx}`);

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
        error: "FAQ 상세 정보를 불러오는데 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("FAQ 상세 조회 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * FAQ 수정
 * @param {number} faqIdx - FAQ 인덱스
 * @param {Object} data - 수정할 데이터 { faqTitle, faqContent, faqType, userType }
 */
export const updateFaq = async (faqIdx, data) => {
  try {
    const response = await apiPut(`/admin/faq/${faqIdx}`, data);

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
        error: "FAQ 수정에 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("FAQ 수정 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * FAQ 등록
 * @param {Object} data - 등록할 데이터 { faqTitle, faqContent, faqType, userType }
 */
export const createFaq = async (data) => {
  try {
    const response = await apiPost("/admin/faq", data);

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
        error: "FAQ 등록에 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("FAQ 등록 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * FAQ 삭제
 * @param {Array<number>} faqList - 삭제할 FAQ 인덱스 목록
 */
export const deleteFaqList = async (faqList) => {
  try {
    const response = await apiDelete("/admin/faq", {
      body: JSON.stringify({ faqList })
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
        error: "FAQ 삭제에 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("FAQ 삭제 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};

/**
 * FAQ 검색
 * @param {Object} params - 검색 파라미터
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 */
export const searchFaq = async (params, page = 0, size = 10) => {
  try {
    // 쿼리 스트링 구성
    const queryParams = new URLSearchParams();
    
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);
    
    // faqType 변환 (한글 description → enum 코드)
    let faqTypeValue = params.faqType;
    if (faqTypeValue) {
      const faqTypeMap = {
        "회원/계정": "CUST_ACCOUNT",
        "주문/결제": "CUST_ORDER",
        "취소/환불": "CUST_REFUND",
        "기타": "ETC",
        "상품/주문": "STORE_PRODUCT",
        "상품": "CUST_PRODUCT",
        "정산/결제": "STORE_SETTLEMENT",
        "시스템/운영": "SYSTEM",
      };
      faqTypeValue = faqTypeMap[faqTypeValue] || faqTypeValue;
      queryParams.append("faqType", faqTypeValue);
    }
    
    // userType 변환 (한글 → enum 코드)
    let userTypeValue = params.userType;
    if (userTypeValue === "사용자") {
      userTypeValue = "CUST";
    } else if (userTypeValue === "가맹점") {
      userTypeValue = "STORE";
    }
    if (userTypeValue) queryParams.append("userType", userTypeValue);
    
    if (params.searchType) queryParams.append("searchType", params.searchType);
    if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm);
    queryParams.append("page", page);
    queryParams.append("size", size);

    const searchUrl = `/admin/faq/search?${queryParams.toString()}`;
    console.log("📡 검색 요청 URL:", searchUrl);
    console.log("📝 검색 파라미터:", {
      startDate: params.startDate,
      endDate: params.endDate,
      faqType: params.faqType,
      userType: params.userType,
      searchType: params.searchType,
      searchTerm: params.searchTerm,
      page,
      size,
    });

    const response = await apiGet(searchUrl);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ 검색 결과:", data);
      return {
        success: true,
        data: data,
        error: null,
      };
    } else {
      console.error("❌ 검색 실패 - 상태 코드:", response.status);
      return {
        success: false,
        data: null,
        error: "FAQ 검색에 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("❌ FAQ 검색 중 오류:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다.",
    };
  }
};
