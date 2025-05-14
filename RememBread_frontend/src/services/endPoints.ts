/**
 * 인증 관련 URL
 * 
 * 소셜로그인 : /auth/login/{socialType}
 * 
 * 토큰 재발급 : /auth/reissue
 * 
 * 로그아웃 : /auth/logout
 */
export const AUTH_END_POINT = {
    SOCIAL_LOGIN: (socialType: string) => `/auth/login/${socialType}`,
    REFRESH_TOKEN: '/auth/reissue',
    LOGOUT: '/auth/logout',
};

/**
 * 유저 정보 관련 URL
 * 
 * COMPLETE_AGREE : /users/agree
 * GET_USER : /users
 * PATCH_USER : /users
 * DELETE_USER : /users
 * GET_CHARACTERS : /users/characters
 * PATCH_FCM_TOKEN : /users/fcm-token
 */
export const USER_END_POINT = {
    COMPLETE_AGREE: '/users/agree',
    GET_USER: '/users',
    PATCH_USER: '/users',
    DELETE_USER: '/users',
    GET_CHARACTERS: '/users/characters',
    PATCH_FCM_TOKEN: '/users/fcm-token',
}