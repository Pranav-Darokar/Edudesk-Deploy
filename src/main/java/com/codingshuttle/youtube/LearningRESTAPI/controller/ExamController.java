package com.codingshuttle.youtube.LearningRESTAPI.controller;

import com.codingshuttle.youtube.LearningRESTAPI.entity.Exam;
import com.codingshuttle.youtube.LearningRESTAPI.entity.ExamResult;
import com.codingshuttle.youtube.LearningRESTAPI.service.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

@RestController
@RequestMapping("/exams")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;

    @GetMapping
    public ResponseEntity<List<Exam>> getAllExams() {
        return ResponseEntity.ok(examService.getAllExams());
    }

    @GetMapping("/my-exams") // Students can view all exams for now
    public ResponseEntity<List<Exam>> getMyExams() {
        return ResponseEntity.ok(examService.getAllExams());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Exam> scheduleExam(@RequestBody Exam exam) {
        return ResponseEntity.ok(examService.scheduleExam(exam));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Void> deleteExam(@PathVariable Long id) {
        examService.deleteExam(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Exam> updateExam(@PathVariable Long id, @RequestBody Exam exam) {
        return ResponseEntity.ok(examService.updateExam(id, exam));
    }

    @GetMapping("/{examId}/results")
    public ResponseEntity<List<ExamResult>> getResults(@PathVariable Long examId) {
        return ResponseEntity.ok(examService.getResultsByExam(examId));
    }

    @PostMapping("/{examId}/results/{studentId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<ExamResult> recordResult(
            @PathVariable Long examId,
            @PathVariable Long studentId,
            @RequestBody ExamResult result) {
        return ResponseEntity.ok(examService.recordResult(studentId, examId, result));
    }

    @PatchMapping("/{examId}/publish")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Void> publishResults(@PathVariable Long examId) {
        examService.publishResults(examId);
        return ResponseEntity.ok().build();
    }
}
