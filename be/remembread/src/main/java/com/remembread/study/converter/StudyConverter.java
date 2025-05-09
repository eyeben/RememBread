package com.remembread.study.converter;

import com.remembread.study.dto.response.RouteResponse;
import com.remembread.study.entity.StudySession;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.LineString;

import java.util.ArrayList;
import java.util.List;

public class StudyConverter {
    public static List<List<Double>> toRoute(LineString lineString) {
        List<List<Double>> route = new ArrayList<>();
        for (Coordinate coordinate : lineString.getCoordinates()) {
            ArrayList<Double> point = new ArrayList<>();
            point.add(coordinate.getX());
            point.add(coordinate.getY());
            route.add(point);
        }
        return route;
    }

    public static RouteResponse toRouteResponse(List<StudySession> studySessions) {
        RouteResponse response = RouteResponse.builder()
                .cardSetId(studySessions.get(0).getCardSet().getId())
                .total(studySessions.size())
                .routes(new ArrayList<>())
                .build();
        List<RouteResponse.Route> routes =  response.getRoutes();
        for (StudySession studySession : studySessions) {
            routes.add(toRoute(studySession));
        }
        return response;
    }

    public static RouteResponse.Route toRoute(StudySession studySession) {
        return RouteResponse.Route.builder()
                .studiedAt(studySession.getStudiedAt())
                .route(toRoute(studySession.getRoute()))
                .build();
    }
}
