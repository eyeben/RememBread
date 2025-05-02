import http from '@/services/httpCommon';
import { USER_END_POINT } from '@/services/endPoints';

interface AgreeResponse {
  isSuccess: boolean;
}

interface UserResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    nickname: string;
    mainCharacterId: number;
    pushEnable: boolean;
    socialLoginType: string;
  };
}

interface UpdateUserParams {
  nickname?: string;
  pushEnable?: boolean;
  mainCharacterId?: number;
}

interface CharacterResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    id: number;
    name: string;
    isLocked: boolean;
  }[];
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
 * 
 * 닉네임, 푸시 알림 설정, 메인 캐릭터 이미지 조회
 */
export const getUser = async (): Promise<UserResponse> => {
  try {
    const response = await http.get<UserResponse>(USER_END_POINT.GET_USER);
    return response.data;
  } catch (error) {
    throw new Error('유저 정보 조회 중 오류가 발생했습니다.');
  }
};

/**
 * 유저 정보 수정
 * 
 * 이름, 푸시 알림 설정, 메인 캐릭터 이미지 수정
 */
export const updateUser = async (body: UpdateUserParams): Promise<UserResponse> => {
  try {
    const response = await http.patch<UserResponse>(USER_END_POINT.PATCH_USER, body);
    return response.data;
  } catch (error) {
    throw new Error('유저 정보 수정 중 오류가 발생했습니다.');
  }
};

/**
 * 유저 삭제
 * 
 * 유저 삭제 요청
 */
export const deleteUser = async (): Promise<UserResponse> => {
  try {
    const response = await http.delete<UserResponse>(USER_END_POINT.DELETE_USER);
    return response.data;
  } catch (error) {
    throw new Error('유저 삭제 중 오류가 발생했습니다.');
  }
};

/**
 * 캐릭터 목록 조회
 * 
 * 사용 가능한 캐릭터 목록을 조회
 */
export const getCharacters = async (): Promise<CharacterResponse> => {
  try {
    const response = await http.get<CharacterResponse>(USER_END_POINT.GET_CHARACTERS);
    return response.data;
  } catch (error) {
    throw new Error('캐릭터 목록을 불러오는 중 오류가 발생했습니다.');
  }
};
