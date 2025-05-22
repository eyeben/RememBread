package com.remembread.study.dto.response;

import java.time.LocalDate;

public interface DayLogProjection {
    LocalDate getDate();
    Integer getStudyTime();
    Integer getTotalCorrect();
    Integer getTotalSolved();
}
