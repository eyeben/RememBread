package com.remembread.study.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RouteResponse {
    private Long cardSetId;
    private Integer total;
    private List<Route> routes;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Route {
        private LocalDateTime studiedAt;
        private List<List<Double>> route;
    }
}
