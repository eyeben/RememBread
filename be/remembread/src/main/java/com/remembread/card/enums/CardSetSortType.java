package com.remembread.card.enums;

import com.remembread.apipayload.code.status.ErrorStatus;
import com.remembread.apipayload.exception.GeneralException;

public enum CardSetSortType {
    최신순("created_at") ,인기순("views") , 포크순("forks"), 이름순("name");

    private final String column;

    CardSetSortType(String column) {
        this.column = column;
    }

    public String getColumn() {
        return column;
    }
    public static String getColumnByKor(String kor) {
        try {
            return CardSetSortType.valueOf(kor).getColumn();
        } catch (IllegalArgumentException e) {
            throw new GeneralException(ErrorStatus.ENUM_NOT_FOUND);
        }
    }
}
