import http from './httpCommon';
import { USER_END_POINT } from './endPoints';

interface AgreeResponse {
  isSuccess: boolean;
}

interface UserResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    nickname: string;
    mainCharacterImageUrl: string;
    pushEnable: boolean;
    socialLoginType: string;
  };
}

/**
 * 약관 동의 완료 확인용
 * 
 * 약관 동의 완료 시 백엔드에 완료했다는 플래그 송신
 */
export const completeAgree = async (): Promise<AgreeResponse> => {
  try {
    const response = await http.patch<AgreeResponse>(USER_END_POINT.COMPLETE_AGREE);
    return response.data;
  } catch (error) {
    throw new Error('약관 동의 처리 중 오류가 발생했습니다.');
  }
};

/**
 * 유저 정보 조회
 */
export const getUser = async (): Promise<UserResponse> => {
  try {
    const response = await http.get<UserResponse>(USER_END_POINT.GET_USER);
    return response.data;
  } catch (error) {
    throw new Error('유저 정보 조회 중 오류가 발생했습니다.');
  }
};
