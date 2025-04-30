package com.remembread.apipayload.exception;

import com.remembread.apipayload.code.BaseErrorCode;
import com.remembread.apipayload.code.ErrorReasonDto;
import com.remembread.apipayload.code.status.ErrorStatus;
import lombok.Getter;

@Getter
public class GeneralException extends RuntimeException{
    private BaseErrorCode code;
    private final Object[] args;  // 메시지 포맷에 들어갈 인자들

    public GeneralException(BaseErrorCode code, Object... args) {
        super(code.getReason().getMessage());
        this.code = code;
        this.args = args;
    }

    public ErrorReasonDto getErrorReason(){
        if (code instanceof ErrorStatus errorStatus && args != null && args.length > 0) {
            return errorStatus.getReason(args);
        }
        return this.code.getReason();
    }

    public ErrorReasonDto getErrorReasonHttpStatus(){
        if (code instanceof ErrorStatus errorStatus && args != null && args.length > 0) {
            return errorStatus.getReasonHttpStatus(args);
        }
        return this.code.getReasonHttpStatus();
    }
}