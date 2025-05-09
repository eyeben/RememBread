package com.remembread.study.dto.request;

import lombok.Getter;

@Getter
public class StudyStopRequest {
    private Long lastCardId;
    private Double latitude;
    private Double longitude;
}
