package com.codingshuttle.youtube.LearningRESTAPI.service.impl;

import com.codingshuttle.youtube.LearningRESTAPI.dto.DashboardStatsDto;
import com.codingshuttle.youtube.LearningRESTAPI.entity.FeePayment;
import com.codingshuttle.youtube.LearningRESTAPI.repository.*;
import com.codingshuttle.youtube.LearningRESTAPI.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final CourseRepository courseRepository;
    private final FeePaymentRepository feePaymentRepository;

    @Override
    public DashboardStatsDto getAdminStats() {
        long studentCount = studentRepository.count();
        long teacherCount = teacherRepository.count();
        long courseCount = courseRepository.count();

        List<FeePayment> allPayments = feePaymentRepository.findAll();
        double totalFees = allPayments.stream()
                .filter(p -> p.getAmountPaid() != null)
                .mapToDouble(p -> p.getAmountPaid().doubleValue())
                .sum();

        // Simplified trends - in a real app these would be DB aggregations
        List<Map<String, Object>> enrollmentTrend = List.of(
                Map.of("month", "Jan", "count", studentCount / 4),
                Map.of("month", "Feb", "count", studentCount / 3),
                Map.of("month", "Mar", "count", studentCount / 2),
                Map.of("month", "Apr", "count", studentCount));

        return DashboardStatsDto.builder()
                .totalStudents(studentCount)
                .totalTeachers(teacherCount)
                .totalCourses(courseCount)
                .totalFeesCollected(totalFees)
                .enrollmentTrend(enrollmentTrend)
                .feeCollectionTrend(Collections.emptyList())
                .roleDistribution(Map.of(
                        "Students", studentCount,
                        "Teachers", teacherCount))
                .build();
    }
}
