package com.codingshuttle.youtube.LearningRESTAPI.controller;

import com.codingshuttle.youtube.LearningRESTAPI.entity.Attendance;
import com.codingshuttle.youtube.LearningRESTAPI.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final com.codingshuttle.youtube.LearningRESTAPI.repository.UserRepository userRepository;

    @GetMapping("/my-attendance")
    public ResponseEntity<List<Attendance>> getMyAttendance() {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication()
                .getName();
        com.codingshuttle.youtube.LearningRESTAPI.entity.User student = userRepository.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(attendanceService.getStudentAttendance(student.getId()));
    }

    @GetMapping("/daily")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<List<Attendance>> getDaily(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getDailyAttendance(date));
    }

    @PostMapping("/mark")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Void> mark(@RequestBody Map<String, Object> request) {
        attendanceService.markAttendance(
                ((Number) request.get("studentId")).longValue(),
                LocalDate.parse((String) request.get("date")),
                (Boolean) request.get("present"),
                (String) request.get("remarks"));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/bulk")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Void> bulkMark(@RequestBody Map<String, Object> request) {
        Object idsObj = request.get("studentIds");
        if (!(idsObj instanceof List<?> idsList)) {
            throw new IllegalArgumentException("studentIds must be a list");
        }
        List<Long> studentIds = idsList.stream()
                .filter(Number.class::isInstance)
                .map(n -> ((Number) n).longValue())
                .toList();

        attendanceService.bulkMarkAttendance(
                studentIds,
                LocalDate.parse((String) request.get("date")),
                (Boolean) request.get("present"));
        return ResponseEntity.ok().build();
    }
}
