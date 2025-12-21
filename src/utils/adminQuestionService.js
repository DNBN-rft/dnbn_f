/**
 * 관리자 문의사항 API 서비스
 */

import { apiGet, apiPost, apiPut } from "./apiClient";

/**
 * 문의사항 목록 조회 (페이지네이션)
 * GET /api/admin/question
 * @param {number} page - 페이지 번호 (0부터 시작)
 * @param {number} size - 페이지 크기
 */
export const getQuestionList = async (page = 0, size = 10) => {
  try {
    const response = await apiGet(`/admin/question?page=${page}&size=${size}`);
    if (!response.ok) {
      throw new Error("문의사항 목록을 불러오는데 실패했습니다.");
    }
    return await response.json();
  } catch (error) {
    console.error("문의사항 목록 조회 실패:", error);
    throw error;
  }
};

/**
 * 문의사항 상세 조회
 * GET /api/admin/question/{questionIdx}
 */
export const getQuestionDetail = async (questionIdx) => {
  try {
    const response = await apiGet(`/admin/question/${questionIdx}`);
    if (!response.ok) {
      throw new Error("문의사항 상세 정보를 불러오는데 실패했습니다.");
    }
    return await response.json();
  } catch (error) {
    console.error("문의사항 상세 조회 실패:", error);
    throw error;
  }
};

/**
 * 문의사항 답변 등록
 * POST /api/admin/question/{questionIdx}
 */
export const registerAnswer = async (questionIdx, answerContent) => {
  try {
    const response = await apiPost(`/admin/question/${questionIdx}`, {
      body: JSON.stringify({ answerContent }),
    });
    if (!response.ok) {
      throw new Error("답변 등록에 실패했습니다.");
    }
    return await response.text();
  } catch (error) {
    console.error("답변 등록 실패:", error);
    throw error;
  }
};

/**
 * 문의사항 답변 수정
 * PUT /api/admin/question/{questionIdx}
 */
export const modifyAnswer = async (questionIdx, answerContent) => {
  try {
    const response = await apiPut(`/admin/question/${questionIdx}`, {
      body: JSON.stringify({ answerContent }),
    });
    if (!response.ok) {
      throw new Error("답변 수정에 실패했습니다.");
    }
    return await response.text();
  } catch (error) {
    console.error("답변 수정 실패:", error);
    throw error;
  }
};

/**
 * 문의사항 검색 (페이지네이션)
 * GET /api/admin/question/search
 * @param {object} searchParams - 검색 조건
 * @param {number} page - 페이지 번호 (0부터 시작)
 * @param {number} size - 페이지 크기
 */
export const searchQuestions = async (searchParams, page = 0, size = 10) => {
  try {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', size);
    
    if (searchParams.isAnswered !== undefined && searchParams.isAnswered !== null) {
      params.append('isAnswered', searchParams.isAnswered);
    }
    if (searchParams.isMod !== undefined && searchParams.isMod !== null) {
      params.append('isMod', searchParams.isMod);
    }
    if (searchParams.userType) {
      params.append('userType', searchParams.userType);
    }
    if (searchParams.startDate) {
      params.append('startDate', searchParams.startDate);
    }
    if (searchParams.endDate) {
      params.append('endDate', searchParams.endDate);
    }
    if (searchParams.questionRequestType) {
      params.append('questionRequestType', searchParams.questionRequestType);
    }
    if (searchParams.searchTerm) {
      params.append('searchTerm', searchParams.searchTerm);
    }
    if (searchParams.searchType) {
      params.append('searchType', searchParams.searchType);
    }

    const response = await apiGet(`/admin/question/search?${params.toString()}`);
    if (!response.ok) {
      throw new Error("문의사항 검색에 실패했습니다.");
    }
    return await response.json();
  } catch (error) {
    console.error("문의사항 검색 실패:", error);
    throw error;
  }
};
