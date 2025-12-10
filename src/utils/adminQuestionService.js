/**
 * 관리자 문의사항 API 서비스
 */

import { apiGet, apiPost, apiPut } from "./apiClient";

/**
 * 문의사항 목록 조회
 * GET /api/admin/question
 */
export const getQuestionList = async () => {
  try {
    const response = await apiGet("/admin/question");
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
