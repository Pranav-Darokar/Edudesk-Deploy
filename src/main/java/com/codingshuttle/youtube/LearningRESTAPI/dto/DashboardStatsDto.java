package com.codingshuttle.youtube.LearningRESTAPI.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardStatsDto {
    private long totalStudents;
    private long totalTeachers;
    private long totalCourses;
    private double totalFeesCollected;

    // Growth trends (month -> count)
    private List<Map<String, Object>> enrollmentTrend;
    private List<Map<String, Object>> feeCollectionTrend;

    // Distribution
    private Map<String, Long> roleDistribution;
}
