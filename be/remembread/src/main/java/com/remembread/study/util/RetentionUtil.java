package com.remembread.study.util;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

public final class RetentionUtil {

    private static final Double SECONDS_IN_A_DAY = 86400.0;

    private RetentionUtil() {}

    public static Double calcRetentionRate(LocalDateTime lastReview, Double stability) {
        double timeDiff = (double) ChronoUnit.SECONDS.between(lastReview, LocalDateTime.now());
        return Math.exp(-timeDiff / SECONDS_IN_A_DAY * Math.pow(stability, 2));
    }

    public static Double calcRetentionRate(LocalDateTime lastReview, LocalDateTime now, Double stability) {
        double timeDiff = (double) ChronoUnit.SECONDS.between(lastReview, now);
        return Math.exp(-timeDiff / SECONDS_IN_A_DAY * Math.pow(stability, 2));
    }

    public static Double calcThreshold(Double stability) {
        return 3.8 * Math.exp(-1.4 * stability);
    }
}
