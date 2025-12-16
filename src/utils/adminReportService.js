import { apiGet, apiPost, apiPut } from "./apiClient";
/**
 * 신고 목록 조회
 * GET /api/admin/report
 */
export const getReportList = async () => {
  try {
    const response = await apiGet("/admin/report");
    if (!response.ok) {
      throw new Error("신고 목록을 불러오는데 실패했습니다.");
    }
    return await response.json();
  } catch (error) {
    console.error("신고 목록 조회 실패:", error);
    throw error;
  }
};
/**
 * 신고 상세 조회
 * GET /api/admin/report/{reportIdx}
 */
export const getReportDetail = async (reportIdx) => {
  try {
    const response = await apiGet(`/admin/report/${reportIdx}`);
    if (!response.ok) {
      throw new Error("신고 상세 정보를 불러오는데 실패했습니다.");
    }
    return await response.json();
  } catch (error) {
    console.error("신고 상세 조회 실패:", error);
    throw error;
  }
};
/**
 * 신고 답변 등록
 * POST /api/admin/report/{reportIdx}
 */
export const registerAnswer = async (reportIdx, answerData) => {
  try {
    const response = await apiPost(`/admin/report/${reportIdx}`, answerData);
    if (!response.ok) {
      throw new Error("신고 답변을 등록하는데 실패했습니다.");
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    console.error("신고 답변 등록 실패:", error);
    throw error;
  }
};
/**
 * 신고 답변 수정
 * PUT /api/admin/report/{reportIdx}
 */
export const modAnswer = async (reportIdx, answerData) => {
  try {
    const response = await apiPut(`/admin/report/${reportIdx}`, answerData);
    if (!response.ok) {
      throw new Error("신고 답변을 수정하는데 실패했습니다.");
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    console.error("신고 답변 수정 실패:", error);
    throw error;
  }
};
/**
 * 신고 검색
 * GET /api/admin/report/search
 */
export const searchReports = async (searchParams) => {
  try {
    const queryString = new URLSearchParams();
    if (searchParams.startDate) {
      queryString.append("startDate", searchParams.startDate);
    }
    if (searchParams.endDate) {
      queryString.append("endDate", searchParams.endDate);
    }
    if (searchParams.isAnswered !== null && searchParams.isAnswered !== undefined) {
      queryString.append("isAnswered", searchParams.isAnswered);
    }
    if (searchParams.reportType) {
      queryString.append("reportType", searchParams.reportType);
    }
    if (searchParams.reportStatus) {
      queryString.append("reportStatus", searchParams.reportStatus);
    }
    if (searchParams.reportReason) {
      queryString.append("reportReason", searchParams.reportReason);
    }
    if (searchParams.searchType) {
      queryString.append("searchType", searchParams.searchType);
    }
    if (searchParams.searchTerm) {
      queryString.append("searchTerm", searchParams.searchTerm);
    }
    const endpoint = `/admin/report/search?${queryString.toString()}`;
    const response = await apiGet(endpoint);
    if (!response.ok) {
      throw new Error("신고 검색에 실패했습니다.");
    }
    return await response.json();
  } catch (error) {
    console.error("신고 검색 실패:", error);
    throw error;
  }
};