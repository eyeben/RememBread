package com.remembread.study.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class StudyStopRequest {
    private Long lastCardId;
    @NotNull
    private Double latitude;
    @NotNull
    private Double longitude;
}
