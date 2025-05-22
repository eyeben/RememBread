package com.remembread.study.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class LocationRequest {
    @NotNull
    private Double latitude;
    @NotNull
    private Double longitude;
}
