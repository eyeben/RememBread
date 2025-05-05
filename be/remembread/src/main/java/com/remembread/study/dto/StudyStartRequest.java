package com.remembread.study.dto;

import com.remembread.study.enums.StudyMode;
import lombok.Data;

@Data
public class StudyStartRequest {
    private Integer count;
    private StudyMode mode;
    private Double latitude;
    private Double longitude;
}
