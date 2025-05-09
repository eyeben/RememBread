package com.remembread.study.dto.request;

import com.remembread.study.enums.StudyMode;
import lombok.Getter;

@Getter
public class StudyStartRequest {
    private Integer count;
    private StudyMode mode;
    private Double latitude;
    private Double longitude;
}
