package com.remembread.study.dto.response;

import java.time.LocalDate;

public interface DayLogProjection {
    LocalDate getDay();
    Integer getTotalCorrect();
    Integer getTotalSolved();
}
