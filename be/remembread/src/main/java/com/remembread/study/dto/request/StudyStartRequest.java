package com.remembread.study.dto.request;

import com.remembread.study.enums.StudyMode;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class StudyStartRequest {
    @Min(1)
    @Max(100)
    private Integer count;
    @NotNull
    private StudyMode mode;
    @NotNull
    private Double latitude;
    @NotNull
    private Double longitude;
}
