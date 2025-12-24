/**
 * Admin Employee API Service
 * 직원 관리 관련 API 호출 함수들
 */

import { apiDelete, apiGet, apiPost, apiPut } from "./apiClient";

/**
 * 직원 목록 조회 (페이지네이션)
 * GET /api/admin/employee
 * @param {number} page - 페이지 번호 (0부터 시작)
 * @param {number} size - 페이지 크기
 */
export const getEmployeeList = async (page = 0, size = 10) => {
  try {
    const response = await apiGet(`/admin/employee?page=${page}&size=${size}`);

    if (!response.ok) {
      throw new Error("직원 목록 조회에 실패했습니다.");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("직원 목록 조회 에러:", error);
    return { success: false, error: error.message };
  }
};

/**
 * 직원 등록
 * POST /api/admin/employee
 * @param {Object} employeeData - 직원 등록 정보
 * @param {string} employeeData.empId - 직원 아이디
 * @param {string} employeeData.empPw - 직원 비밀번호
 * @param {string} employeeData.empTelNo - 직원 전화번호
 * @param {number} employeeData.authIdx - 권한 인덱스
 * @param {string} employeeData.empNm - 직원 이름
 */
export const registerEmployee = async (employeeData) => {
  try {
    const response = await apiPost("/admin/employee", JSON.stringify(employeeData));

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "직원 등록에 실패했습니다.");
    }

    const data = await response.text();
    return data;
  } catch (error) {
    console.error("직원 등록 에러:", error);
    throw error;
  }
};

/**
 * 직원 비밀번호 변경
 * PUT /api/admin/employee/changePw
 * @param {Object} passwordData - 비밀번호 변경 정보
 * @param {string} passwordData.empId - 직원 아이디
 * @param {string} passwordData.newPw - 새 비밀번호
 */
export const changeEmployeePassword = async (passwordData) => {
  try {
    const response = await apiPut("/admin/employee/changePw", passwordData);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "비밀번호 변경에 실패했습니다.");
    }

    const data = await response.text();
    return data;
  } catch (error) {
    console.error("비밀번호 변경 에러:", error);
    throw error;
  }
};

/**
 * 직원 아이디 중복 확인
 * GET /api/admin/employee/duplicate/{loginId}
 * @param {string} loginId - 확인할 로그인 아이디
 * @returns {boolean} true면 중복, false면 사용가능
 */
export const checkDuplicateLoginId = async (loginId) => {
  try {
    const response = await apiGet(`/admin/employee/duplicate/${loginId}`);

    if (!response.ok) {
      throw new Error("아이디 중복 확인에 실패했습니다.");
    }

    const isDuplicate = await response.json();
    return isDuplicate;
  } catch (error) {
    console.error("아이디 중복 확인 에러:", error);
    throw error;
  }
};

/**
 * 직원 상태 변경
 * PUT /api/admin/employee/status
 * @param {Object} statusData - 상태 변경 정보
 * @param {string} statusData.empId - 직원 아이디
 * @param {string} statusData.empState - 변경할 상태 (ACTIVE, SUSPENDED, WITHDRWAL)
 */
export const changeEmployeeStatus = async (statusData) => {
  try {
    const response = await apiPut("/admin/employee/status", statusData);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "직원 상태 변경에 실패했습니다.");
    }

    const data = await response.text();
    return data;
  } catch (error) {
    console.error("직원 상태 변경 에러:", error);
    throw error;
  }
};

/**
 * 직원 삭제 (페이지네이션)
 * DELETE /api/admin/employee
 * @param {Object} deleteData - 삭제 정보
 * @param {string[]} deleteData.empIdList - 삭제할 직원 아이디 목록
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 */
export const deleteEmployeeList = async (deleteData, page = 0, size = 10) => {
  try {
    const response = await apiDelete(`/admin/employee?page=${page}&size=${size}`, JSON.stringify(deleteData));

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "직원 삭제에 실패했습니다.");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("직원 삭제 에러:", error);
    return { success: false, error: error.message };
  }
};

/**
 * 직원 검색 (페이지네이션)
 * GET /api/admin/employee/search
 * @param {Object} searchParams - 검색 파라미터
 * @param {string} searchParams.empState - 직원 상태
 * @param {string} searchParams.searchType - 검색 타입
 * @param {string} searchParams.searchTerm - 검색어
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 */
export const searchEmployees = async (searchParams, page = 0, size = 10) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...searchParams
    });

    const response = await apiGet(`/admin/employee/search?${params.toString()}`);

    if (!response.ok) {
      throw new Error("직원 검색에 실패했습니다.");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("직원 검색 에러:", error);
    return { success: false, error: error.message };
  }
};