import { apiGet, apiPostFormData, apiPutFormData, apiDelete } from "./apiClient";

const API_BASE_URL = "/admin/category";

// 카테고리 목록 조회
export const fetchCategories = async () => {
  try {
    const response = await apiGet(API_BASE_URL);
    if (!response.ok) {
      throw new Error("카테고리 목록 조회 실패");
    }
    return await response.json();
  } catch (error) {
    console.error("카테고리 목록 조회 실패:", error);
    throw error;
  }
};

// 카테고리 검색
export const searchCategories = async (searchType, searchTerm) => {
  try {
    const params = new URLSearchParams({
      searchType: searchType === "all" ? "categoryNm" : searchType,
      searchTerm
    });
    const response = await apiGet(`${API_BASE_URL}/search?${params.toString()}`);
    if (!response.ok) {
      throw new Error("카테고리 검색 실패");
    }
    return await response.json();
  } catch (error) {
    console.error("카테고리 검색 실패:", error);
    throw error;
  }
};

// 카테고리 등록
export const registerCategory = async (categoryData) => {
  try {
    const formData = new FormData();
    formData.append("categoryNm", categoryData.categoryNm);
    
    if (categoryData.categoryImg) {
      formData.append("categoryImg", categoryData.categoryImg);
    }

    const response = await apiPostFormData(API_BASE_URL, formData);
    if (!response.ok) {
      throw new Error("카테고리 등록 실패");
    }
    return true;
  } catch (error) {
    console.error("카테고리 등록 실패:", error);
    throw error;
  }
};

// 카테고리 수정
export const modifyCategory = async (categoryData) => {
  try {
    const formData = new FormData();
    formData.append("categoryIdx", categoryData.categoryIdx);
    formData.append("categoryNm", categoryData.categoryNm);
    
    if (categoryData.categoryImg) {
      formData.append("categoryImg", categoryData.categoryImg);
    }

    const response = await apiPutFormData(API_BASE_URL, formData);
    if (!response.ok) {
      throw new Error("카테고리 수정 실패");
    }
    return true;
  } catch (error) {
    console.error("카테고리 수정 실패:", error);
    throw error;
  }
};

// 카테고리 삭제
export const deleteCategory = async (categoryIdx) => {
  try {
    const response = await apiDelete(`${API_BASE_URL}/${categoryIdx}`);
    if (!response.ok) {
      throw new Error("카테고리 삭제 실패");
    }
    return true;
  } catch (error) {
    console.error("카테고리 삭제 실패:", error);
    throw error;
  }
};

// 여러 카테고리 일괄 삭제
export const deleteCategories = async (categoryIdxList) => {
  try {
    const deletePromises = categoryIdxList.map(idx => deleteCategory(idx));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("카테고리 일괄 삭제 실패:", error);
    throw error;
  }
};
