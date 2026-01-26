package com.codingshuttle.youtube.LearningRESTAPI.service;

import com.codingshuttle.youtube.LearningRESTAPI.entity.Attendance;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {
    void markAttendance(Long studentId, LocalDate date, boolean present, String remarks);

    List<Attendance> getDailyAttendance(LocalDate date);

    List<Attendance> getStudentAttendanceReport(Long studentId, LocalDate start, LocalDate end);

    void bulkMarkAttendance(List<Long> studentIds, LocalDate date, boolean present);
}
