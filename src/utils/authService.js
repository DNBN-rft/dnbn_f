/**
 * 로그인 처리 서비스
 */

/**
 * 로그인 API 호출 및 localStorage에 사용자 정보 저장
 * @param {string} username - 사용자 아이디
 * @param {string} password - 사용자 비밀번호
 * @returns {Promise<Object>} - 로그인 결과 { success: boolean, data: Object, error: string }
 */
export const login = async (username, password) => {
  try {
    const response = await fetch("http://localhost:8080/api/auth/store/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 쿠키를 자동으로 포함
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      
      // localStorage에 사용자 정보 저장
      const user = {
        memberNm: data.memberNm,
        storeCode: data.storeCode,
        planNm: data.subscriptionNm,
      };
      localStorage.setItem("user", JSON.stringify(user));

      return {
        success: true,
        data: user,
        error: null,
      };
    } else {
      const errorText = await response.text();
      let errorMessage = "로그인에 실패했습니다.";
      
      if (response.status === 401) {
        errorMessage = "아이디 또는 비밀번호가 잘못되었습니다.";
      } else if (errorText) {
        errorMessage = errorText;
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
 * localStorage에서 사용자 정보 가져오기
 * @returns {Object|null} - 사용자 정보 또는 null
 */
export const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("사용자 정보 읽기 실패:", error);
    return null;
  }
};

/**
 * localStorage에서 사용자 정보 삭제
 */
export const clearUserFromStorage = () => {
  localStorage.removeItem("user");
};
