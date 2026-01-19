/**
 * 로그인 처리 서비스
 */
import apiClient, { apiPost } from "./apiClient";

/**
 * 로그인 API 호출 및 localStorage에 사용자 정보 저장
 * @param {string} username - 사용자 아이디
 * @param {string} password - 사용자 비밀번호
 * @returns {Promise<Object>} - 로그인 결과 { success: boolean, data: Object, error: string }
 */
export const login = async (username, password) => {
  try {
    const response = await apiPost("/store/login", {username: username, password: password});

    if (response.ok) {
      const data = await response.json();
      localStorage.clear();
      
      // localStorage에 사용자 정보 저장
      const user = {
        memberNm: data.memberNm,
        storeCode: data.storeCode,
        planNm: data.subscriptionNm,
        memberId: data.memberId,
        menuAuth: data.authorities
      };
      localStorage.setItem("user", JSON.stringify(user));

      // 로그인 성공 시 주기적 토큰 갱신 시작
      apiClient.startTokenRefresh();

      return {
        success: true,
        data: user,
        error: null,
      };
    } else {
      const errorText = await response.text();
      let errorMessage = "로그인에 실패했습니다.";
      
      if (response.status === 401) {
        // 401 에러 시 공통 메시지 사용
        errorMessage = "아이디 또는 비밀번호가 일치하지 않습니다.";
      } else if (errorText) {
        // JSON 형식의 에러 메시지 파싱
        try {
          const errorObj = JSON.parse(errorText);
          if (errorObj.message) {
            // 비밀번호/아이디/직원정보 관련 에러는 공통 메시지로 통일
            if (errorObj.message.includes("비밀번호") || 
                errorObj.message.includes("아이디") || 
                errorObj.message.includes("직원") ||
                errorObj.message.includes("찾을 수 없습니다")) {
              errorMessage = "아이디 또는 비밀번호가 일치하지 않습니다.";
            } else {
              errorMessage = errorObj.message;
            }
          }
        } catch {
          // JSON 파싱 실패 시 원본 텍스트에서 message 추출 시도
          const messageMatch = errorText.match(/"message"\s*:\s*"([^"]+)"/);
          if (messageMatch && messageMatch[1]) {
            if (messageMatch[1].includes("비밀번호") || 
                messageMatch[1].includes("아이디") ||
                messageMatch[1].includes("직원") ||
                messageMatch[1].includes("찾을 수 없습니다")) {
              errorMessage = "아이디 또는 비밀번호가 일치하지 않습니다.";
            } else {
              errorMessage = messageMatch[1];
            }
          } else {
            errorMessage = errorText;
          }
        }
      }

      return {
        success: false,
        data: null,
        error: errorMessage,
      };
    }
  } catch (error) {
    console.error("로그인 중 오류 발생:", error);
    return {
      success: false,
      data: null,
      error: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
    };
  }
};

/**
 * localStorage에서 사용자 정보 삭제
 */
export const clearUserFromStorage = () => {
  localStorage.removeItem("user");
  // 로그아웃 시 토큰 자동 갱신 중지
  apiClient.stopTokenRefresh();
};