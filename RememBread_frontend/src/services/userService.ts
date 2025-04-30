import http from './httpCommon';
import { USER_END_POINT } from './endPoints';

interface AgreeResponse {
  isSuccess: boolean;
}

/**
 * 약관 동의 완료 확인용
 * 
 * 약관 동의 완료 시 백엔드에 완료했다는 플래그 송신
 */
export const completeAgree = async (): Promise<AgreeResponse> => {
  try {
    const response = await http.get<AgreeResponse>(USER_END_POINT.COMPLETE_AGREE);
    return response.isSuccess;
  } catch (error) {
    throw new Error('약관 동의 처리 중 오류가 발생했습니다.');
  }
};