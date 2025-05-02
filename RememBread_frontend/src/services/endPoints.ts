/**
 * 인증 관련 URL
 * 
 * Social Login : /auth/login/{socialType}
 * 
 * Refresh Token : /auth/reissue
 * 
 * Logout : /auth/logout
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
 *  
 */
export const USER_END_POINT = {
    COMPLETE_AGREE: '/users/agree',
}