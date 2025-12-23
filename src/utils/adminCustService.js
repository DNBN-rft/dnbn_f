import { apiCall } from "./apiClient";

// 고객 목록 조회
export const getCusts = async (page = 0, size = 10) => {
  try {
    const response = await apiCall(`/admin/cust?page=${page}&size=${size}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// 고객 상세 조회
export const getCustDetail = async (custCode) => {
  try {
    const response = await apiCall(`/admin/cust/${custCode}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// 고객 정보 수정
export const updateCust = async (custCode, modRequest) => {
  try {
    const requestBody = JSON.stringify(modRequest);
    
    const response = await apiCall(`/admin/cust/${custCode}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });


    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${response.status} - ${errorText}`);
    }

    // 응답이 텍스트일 수 있으므로 먼저 텍스트로 읽기
    const contentType = response.headers.get("content-type");
    let responseData;
    
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }
    
    return responseData;
  } catch (error) {
    throw error;
  }
};

// 고객 검색
export const searchCusts = async (searchParams) => {
  try {
    const queryString = new URLSearchParams();
    
    if (searchParams.custState) {
      queryString.append("custState", searchParams.custState);
    }
    if (searchParams.loginType) {
      queryString.append("loginType", searchParams.loginType);
    }
    if (searchParams.searchType) {
      queryString.append("searchType", searchParams.searchType);
    }
    if (searchParams.searchTerm) {
      queryString.append("searchTerm", searchParams.searchTerm);
    }

    const response = await apiCall(`/admin/cust/search?${queryString.toString()}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

// 고객 삭제
export const deleteCusts = async (custCodes) => {
  try {
    const deleteRequest = {
      custCodes: custCodes,
    };

    const response = await apiCall("/admin/cust", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deleteRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${response.status} - ${errorText}`);
    }

    // 응답이 텍스트일 수 있으므로 먼저 텍스트로 읽기
    const contentType = response.headers.get("content-type");
    let responseData;
    
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }
    
    return responseData;
  } catch (error) {
    throw error;
  }
};