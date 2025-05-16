package com.remembread.study.converter;

import com.remembread.study.dto.response.RouteResponse;
import com.remembread.study.dto.response.SummaryLogResponse;
import com.remembread.study.entity.StudySession;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.LineString;

import java.time.LocalDate;
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

    public static SummaryLogResponse toSummaryLogResponse(List<SummaryLogResponse.YearLogResponse.MonthLogResponse.DayLogResponse> dayLogResponses) {
        Integer monthTotalCorrect = 0;
        Integer monthTotalSolved = 0;
        Integer yearTotalCorrect = 0;
        Integer yearTotalSolved = 0;
        Integer totalCorrect = 0;
        Integer totalSolved = 0;
        int lastYear = -1;
        int lastMonth = -1;
        List<SummaryLogResponse.YearLogResponse> years = new ArrayList<>();
        List<SummaryLogResponse.YearLogResponse.MonthLogResponse> months = new ArrayList<>();
        List<SummaryLogResponse.YearLogResponse.MonthLogResponse.DayLogResponse> days = new ArrayList<>();
        for (SummaryLogResponse.YearLogResponse.MonthLogResponse.DayLogResponse dayLogResponse : dayLogResponses) {
            LocalDate studiedAt = dayLogResponse.getDay();
            int year = studiedAt.getYear();
            int month = studiedAt.getMonthValue();
            days.add(dayLogResponse);
            monthTotalCorrect += dayLogResponse.getTotalCorrect();
            monthTotalSolved += dayLogResponse.getTotalSolved();
            if (lastMonth != month) {
                SummaryLogResponse.YearLogResponse.MonthLogResponse monthLogResponse = SummaryLogResponse.YearLogResponse.MonthLogResponse.builder()
                        .month(month)
                        .totalCorrect(monthTotalCorrect)
                        .totalSolved(monthTotalSolved)
                        .days(days)
                        .build();
                months.add(monthLogResponse);
                days = new ArrayList<>();
                yearTotalCorrect += monthTotalCorrect;
                yearTotalSolved += monthTotalSolved;
                monthTotalCorrect = 0;
                monthTotalSolved = 0;
                lastMonth = month;
            }
            if (lastYear != year) {
                SummaryLogResponse.YearLogResponse yearLogResponse = SummaryLogResponse.YearLogResponse.builder()
                        .year(year)
                        .totalCorrect(yearTotalCorrect)
                        .totalSolved(yearTotalSolved)
                        .months(months)
                        .build();
                years.add(yearLogResponse);
                months = new ArrayList<>();
                totalCorrect += yearTotalCorrect;
                totalSolved += yearTotalSolved;
                yearTotalCorrect = 0;
                yearTotalSolved = 0;
                lastYear = year;
            }

        }
        if (lastMonth != -1) {
            SummaryLogResponse.YearLogResponse.MonthLogResponse monthLogResponse = SummaryLogResponse.YearLogResponse.MonthLogResponse.builder()
                    .month(lastMonth)
                    .totalCorrect(monthTotalCorrect)
                    .totalSolved(monthTotalSolved)
                    .days(days)
                    .build();
            months.add(monthLogResponse);
        }
        if (lastYear != -1) {
            SummaryLogResponse.YearLogResponse yearLogResponse = SummaryLogResponse.YearLogResponse.builder()
                    .year(lastYear)
                    .totalCorrect(yearTotalCorrect)
                    .totalSolved(yearTotalSolved)
                    .months(months)
                    .build();
            years.add(yearLogResponse);
        }
        return SummaryLogResponse.builder()
                .totalCorrect(totalCorrect)
                .totalSolved(totalSolved)
                .years(years)
                .build();
    }
}
