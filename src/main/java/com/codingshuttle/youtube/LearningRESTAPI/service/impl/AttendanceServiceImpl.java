package com.codingshuttle.youtube.LearningRESTAPI.service.impl;

import com.codingshuttle.youtube.LearningRESTAPI.entity.Attendance;
import com.codingshuttle.youtube.LearningRESTAPI.repository.AttendanceRepository;
import com.codingshuttle.youtube.LearningRESTAPI.repository.UserRepository;
import com.codingshuttle.youtube.LearningRESTAPI.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;

    @Override
    public void markAttendance(Long studentId, LocalDate date, boolean present, String remarks) {
        var student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Attendance attendance = Attendance.builder()
                .student(student)
                .date(date)
                .present(present)
                .remarks(remarks)
                .build();

        Attendance saved = attendanceRepository.save(attendance);
        if (saved == null)
            throw new RuntimeException("Failed to save attendance");
    }

    @Override
    public List<Attendance> getDailyAttendance(LocalDate date) {
        return attendanceRepository.findByDate(date);
    }

    @Override
    public List<Attendance> getStudentAttendanceReport(Long studentId, LocalDate start, LocalDate end) {
        return attendanceRepository.findByStudentIdAndDateBetween(studentId, start, end);
    }

    @Override
    public void bulkMarkAttendance(List<Long> studentIds, LocalDate date, boolean present) {
        studentIds.forEach(id -> markAttendance(id, date, present, "Bulk marked"));
    }
}
