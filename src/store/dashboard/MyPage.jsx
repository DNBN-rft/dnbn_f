import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/mypage.css";
import WithdrawalPasswordModal from "./modal/WithdrawalPasswordModal";
import WithdrawalConfirmModal from "./modal/WithdrawalConfirmModal";
import { apiGet } from "../../utils/apiClient";
import { formatDate } from "../../utils/commonService";

const MyPage = () => {
  const navigate = useNavigate();
  const [basicActive, setIsBasicActive] = useState(true);
  const [membershipActive, setIsMembershipActive] = useState(false);
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let userInfo = localStorage.getItem("user");
        const storeCode = JSON.parse(userInfo).storeCode;
        
        const response = await apiGet(`/store/view/${storeCode}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`Failed to fetch store data: ${response.status}`);
        }
        
        const data = await response.json();
        setStoreData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="mypage-wrap">
      <div className="mypage-header">
        <div className="mypage-header-title">마이페이지</div>
      </div>

      {loading ? (
        <div>로딩 중...</div>
      ) : !storeData ? (
        <div>데이터를 불러올 수 없습니다.</div>
      ) : (
        <div className="mypage-top-content-wrap">
          <div className="mypage-top-content-name-wrap">
            <div className="mypage-top-content-name-contain">
              <div className="mypage-top-content-name">{storeData.storeNm}</div>
              <div className="mypage-top-content-confirmtag">{storeData.approvalStatus === 'APPROVED' ? "승인" : "미승인"}</div>
            </div>
            <div className="mypage-top-content-btn-group">
              <button 
                className="mypage-top-content-btn mypage-top-content-edit-btn"
                onClick={() => navigate('/store/edit')}
              >
                수정
              </button>
              <button 
                className="mypage-top-content-btn mypage-top-content-signout-btn"
                onClick={() => setShowPasswordModal(true)}
              >
                탈퇴
              </button>
            </div>
          </div>

          <div className="mypage-top-content">
            <div className="mypage-top-content-tab-group">
              <div
                className={
                  basicActive
                    ? "mypage-top-content-tab mypage-top-content-tab-active"
                    : "mypage-top-content-tab"
                }
                onClick={() => {
                  setIsBasicActive(true);
                  setIsMembershipActive(false);
                }}
              >
                기본 정보
              </div>
              <div
                className={
                  membershipActive
                    ? "mypage-top-content-tab mypage-top-content-tab-active"
                    : "mypage-top-content-tab"
                }
                onClick={() => {
                  setIsMembershipActive(true);
                  setIsBasicActive(false);
                }}
              >
                멤버쉽 정보
              </div>
            </div>
            </div>

          {basicActive && (
            <div className="mypage-middle-content-wrap">
              <div className="mypage-middle-content-left">
                <div className="mypage-middle-content-align">
                  <div className="mypage-middle-content-title">가맹점 정보</div>

                  <div className="mypage-middle-content-info">
                    <div className="mypage-middle-content-subtitle">가맹점명</div>
                    <div className="mypage-middle-content-subcontent">
                      {storeData.storeNm}
                    </div>
                  </div>
                  <div className="mypage-middle-content-info">
                    <div className="mypage-middle-content-subtitle">전화번호</div>
                    <div className="mypage-middle-content-subcontent">
                      {storeData.storeTelNo}
                    </div>
                  </div>
                  <div className="mypage-middle-content-info">
                    <div className="mypage-middle-content-subtitle">주소</div>
                    <div className="mypage-middle-content-subcontent">
                      {storeData.storeAddr} {storeData.storeAddrDetail}
                    </div>
                  </div>
                  <div className="mypage-middle-content-info">
                    <div className="mypage-middle-content-subtitle">누적 신고횟수</div>
                    <div className="mypage-middle-content-subcontent">
                      {storeData.storeReport}회
                    </div>
                  </div>
                </div>

                <div className="mypage-middle-content-align">
                  <div className="mypage-middle-content-title">계좌 정보</div>

                  <div className="mypage-middle-content-info">
                    <div className="mypage-middle-content-subtitle">은행명</div>
                    <div className="mypage-middle-content-subcontent">
                      {storeData.bankNm}
                    </div>
                  </div>
                  <div className="mypage-middle-content-info">
                    <div className="mypage-middle-content-subtitle">계좌번호</div>
                    <div className="mypage-middle-content-subcontent">
                      {storeData.storeAccNo}
                    </div>
                  </div>
                  <div className="mypage-middle-content-info">
                    <div className="mypage-middle-content-subtitle">예금주</div>
                    <div className="mypage-middle-content-subcontent">
                      {storeData.ownerNm}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mypage-middle-content-right">
                <div className="mypage-middle-content-align">
                  <div className="mypage-middle-content-title">사업자 정보</div>

                  <div className="mypage-middle-content-owner-wrap">
                    <div className="mypage-middle-content-info">
                      <div className="mypage-middle-content-subtitle">
                        사업자명
                      </div>
                      <div className="mypage-middle-content-subcontent">
                        {storeData.bizNm}
                      </div>
                    </div>
                    <div className="mypage-middle-content-info">
                      <div className="mypage-middle-content-subtitle">
                        사업자번호
                      </div>
                      <div className="mypage-middle-content-subcontent">
                        {storeData.bizNo}
                      </div>
                    </div>
                    <div className="mypage-middle-content-info">
                      <div className="mypage-middle-content-subtitle">대표</div>
                      <div className="mypage-middle-content-subcontent">
                        {storeData.ownerNm}
                      </div>
                      </div>
                    <div className="mypage-middle-content-info">
                      <div className="mypage-middle-content-subtitle">
                        대표 연락처
                      </div>
                      <div className="mypage-middle-content-subcontent">
                        {storeData.ownerTelNo}
                      </div>
                    </div>
                    <div className="mypage-middle-content-info">
                      <div className="mypage-middle-content-subtitle">
                        가맹점 유형
                      </div>
                      <div className="mypage-middle-content-subcontent">
                        {storeData.storeType}
                      </div>
                    </div>
                    <div className="mypage-middle-content-info">
                      <div className="mypage-middle-content-subtitle">
                        사업자 등록일
                      </div>
                      <div className="mypage-middle-content-subcontent">
                        {storeData.requestedDateTime ? formatDate(storeData.requestedDateTime) : '-'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mypage-middle-content-align">
                  <div className="mypage-middle-content-title">운영 정보</div>
                  <div className="mypage-middle-content-info">
                  </div>
                  <div className="mypage-middle-content-info">
                    <div className="mypage-middle-content-subtitle">오픈시간</div>
                    <div className="mypage-middle-content-subcontent">
                      {storeData.storeOpenTime} ~ {storeData.storeCloseTime}
                    </div>
                  </div>
                  <div className="mypage-middle-content-info">
                    <div className="mypage-middle-content-subtitle">영업일</div>
                    <div className="mypage-middle-content-subcontent">
                      월 ~ 금요일
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}

          {membershipActive && (
            <div className="mypage-middle-content-wrap-m">
              <div className="mypage-middle-content-up">
                <div className="mypage-middle-content-align-m">
                  <div className="mypage-middle-content-title-m">멤버쉽 정보</div>
                  <div className="mypage-middle-content-up-align">
                    <div className="mypage-middle-content-info">
                      <div className="mypage-middle-content-subtitle">
                        활성 멤버쉽 정보
                      </div>
                      <div className="mypage-middle-content-subcontent">
                        {storeData.planNm}
                      </div>
                    </div>
                    <div className="mypage-middle-content-info">
                      <div className="mypage-middle-content-subtitle">
                        구독 시작일
                      </div>
                      <div className="mypage-middle-content-subcontent">
                        {storeData.membershipStartDate ? formatDate(storeData.membershipStartDate) : '-'}
                      </div>
                    </div>
                    <div className="mypage-middle-content-info">
                      <div className="mypage-middle-content-subtitle">
                        다음 결제일
                      </div>
                      <div className="mypage-middle-content-subcontent">
                        {storeData.nextBillingDate ? formatDate(storeData.nextBillingDate) : '-'}
                      </div>
                    </div>
                    <div className="mypage-middle-content-info">
                      <div className="mypage-middle-content-subtitle">
                        결제 금액
                      </div>
                      <div className="mypage-middle-content-subcontent">
                        월 {storeData.planPrice?.toLocaleString()}원
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mypage-middle-content-down-m">
                <div className="mypage-middle-content-align-m2">
                  <div className="mypage-middle-content-title-m">히스토리</div>

                  <div className="mypage-credit-history">
                    <table className="mypage-credit-table">
                      <thead>
                        <tr>
                          <th>기간</th>
                          <th>구독플랜명</th>
                          <th>구독 유형</th>
                          <th>결제금액</th>
                          <th>결제일</th>
                        </tr>
                      </thead>

                      <tbody>
                        {storeData.membershipInfo && storeData.membershipInfo.length > 0 ? (
                          storeData.membershipInfo.map((membership, index) => (
                            <tr key={index}>
                              <td>{formatDate(membership.MembershipStartDate)} ~ {formatDate(membership.MembershipEndDate)}</td>
                              <td>{membership.PlanNm || '-'}</td>
                              <td>{membership.PlanType || '-'}</td>
                              <td>₩{membership.PlanPrice?.toLocaleString() || 0}</td>
                              <td>{formatDate(membership.PaymentDateTime)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5">히스토리가 없습니다.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 비밀번호 확인 모달 */}
      {showPasswordModal && (
        <WithdrawalPasswordModal
          onClose={() => setShowPasswordModal(false)}
          onPasswordVerified={() => {
            setShowPasswordModal(false);
            setShowConfirmModal(true);
          }}
          storeCode={storeData?.storeCode || 1}
        />
      )}

      {/* 탈퇴 확인 모달 */}
      {showConfirmModal && (
        <WithdrawalConfirmModal
          onClose={() => setShowConfirmModal(false)}
          storeCode={storeData?.storeCode || 1}
        />
      )}
    </div>
  );
};

export default MyPage;
