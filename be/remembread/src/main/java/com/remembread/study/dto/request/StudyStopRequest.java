package com.remembread.study.dto.request;

import lombok.Data;

@Data
public class StudyStopRequest {
    private Long lastCardId;
    private Double latitude;
    private Double longitude;
}
