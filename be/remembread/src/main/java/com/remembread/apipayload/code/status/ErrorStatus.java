package com.remembread.apipayload.code.status;

import com.remembread.apipayload.code.BaseErrorCode;
import com.remembread.apipayload.code.ErrorReasonDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorStatus implements BaseErrorCode {
    // 가장 일반적인 응답
    _INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON500", "서버 에러, 관리자에게 문의 바랍니다."),
    _BAD_REQUEST(HttpStatus.BAD_REQUEST,"COMMON400","잘못된 요청입니다."),
    _UNAUTHORIZED(HttpStatus.UNAUTHORIZED,"COMMON401","인증이 필요합니다."),
    _FORBIDDEN(HttpStatus.FORBIDDEN, "COMMON403", "금지된 요청입니다."),

    // 로그인 관련 에러
    UNABLE_TO_GET_USER_INFO(HttpStatus.BAD_REQUEST, "LOGIN4001", "소셜 로그인 공급자로부터 유저 정보를 받아올 수 없습니다."),
    UNABLE_TO_GET_ACCESS_TOKEN(HttpStatus.BAD_REQUEST , "LOGIN4002", "소셜 로그인 공급자로부터 인증 토큰을 받아올 수 없습니다."),
    NOT_FOUND_USER_ID(HttpStatus.BAD_REQUEST , "LOGIN4003", "요청 ID에 해당하는 유저가 존재하지 않습니다."),
    INVALID_SOCIAL_PROVIDER(HttpStatus.BAD_REQUEST , "LOGIN4004", "유효하지 않은 소셜 로그인 공급자입니다."),

    // 토큰 관련 에러
    INVALID_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED , "TOKEN4001", "유효하지 않은 Refresh Token입니다."),
    FAILED_TO_VALIDATE_TOKEN(HttpStatus.UNAUTHORIZED , "TOKEN4002", "토큰 검증에 실패했습니다."),
    INVALID_ACCESS_TOKEN(HttpStatus.UNAUTHORIZED , "TOKEN4003", "유효하지 않은 Access Token입니다."),

    // 캐릭터 관련 에러
    NOT_FOUND_CHARACTER(HttpStatus.BAD_REQUEST , "CHARACTER4001", "요청 ID에 해당하는 캐릭터가 존재하지 않습니다."),

    // 폴터 관련 에러
    FOLDER_NOT_FOUND(HttpStatus.BAD_REQUEST, "FOLDER4004", "폴더가 존재하지 않습니다."),
    FOLDER_FORBIDDEN(HttpStatus.BAD_REQUEST, "FOLDER4003", "폴더에 접근 권한이 없습니다."),

    // 카드셋 관련 에러
    CARDSET_NOT_FOUND(HttpStatus.BAD_REQUEST, "CARDSET4004", "카드셋이 존재하지 않습니다."),
    CARDSET_FORBIDDEN(HttpStatus.BAD_REQUEST, "CARDSET4003", "카드셋에 접근 권한이 없습니다."),
    CARDSET_NOT_PUBLIC(HttpStatus.BAD_REQUEST, "CARDSET4003", "이 카드셋은 볼 수 없습니다."),

    // 카드 관련 에러
    CARD_NOT_FOUND(HttpStatus.BAD_REQUEST, "CARD4004", "카드가 존재하지 않습니다."),
    CARD_FORBIDDEN(HttpStatus.BAD_REQUEST, "CARD4003", "카드에 접근 권한이 없습니다."),


    CARDCACHE_NOT_FOUND(HttpStatus.BAD_REQUEST, "CARDCACHE4004", "캐시된 카드가 존재하지 않습니다."),

    STUDY_NOT_FOUND(HttpStatus.BAD_REQUEST, "STUDY4005", "학습 세션이 존재하지 않습니다."),

    //이넘 에러
    ENUM_NOT_FOUND(HttpStatus.BAD_REQUEST, "ENUM4004", "enum값이 존재하지 않습니다."),
    ;





    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    @Override
    public ErrorReasonDto getReason(){
        return ErrorReasonDto.builder()
                .message(message)
                .code(code)
                .isSuccess(false)
                .build();
    }

    public ErrorReasonDto getReason(Object... args) {
        return ErrorReasonDto.builder()
                .message(String.format(message, args))
                .code(code)
                .isSuccess(false)
                .build();
    }

    @Override
    public ErrorReasonDto getReasonHttpStatus(){
        return ErrorReasonDto.builder()
                .message(message)
                .code(code)
                .isSuccess(false)
                .httpStatus(httpStatus)
                .build();
    }

    public ErrorReasonDto getReasonHttpStatus(Object... args) {
        return ErrorReasonDto.builder()
                .message(String.format(message, args))
                .code(code)
                .isSuccess(false)
                .httpStatus(httpStatus)
                .build();
    }
}
