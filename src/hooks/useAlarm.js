import { useQuery } from "@tanstack/react-query";
import { fetchAlarmList } from "../utils/alarmService";

/**
 * 알림 Query Keys
 */
export const alarmKeys = {
  all: ["alarms"],
  list: (memberId) => [...alarmKeys.all, "list", memberId],
};

/**
 * 알림 목록을 조회하는 훅
 * @param {number} memberId - 회원 ID
 * @param {object} options - React Query 옵션
 * @returns {object} React Query 결과
 */
export const useAlarmList = (memberId, options = {}) => {
  return useQuery({
    queryKey: alarmKeys.list(memberId),
    queryFn: () => fetchAlarmList(memberId),
    enabled: !!memberId, // memberId가 있을 때만 실행
    refetchInterval: 60000, // 60초마다 자동 갱신
    ...options,
  });
};
