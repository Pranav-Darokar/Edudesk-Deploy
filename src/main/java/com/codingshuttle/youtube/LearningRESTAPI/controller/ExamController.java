package com.codingshuttle.youtube.LearningRESTAPI.controller;

import com.codingshuttle.youtube.LearningRESTAPI.entity.Exam;
import com.codingshuttle.youtube.LearningRESTAPI.entity.ExamResult;
import com.codingshuttle.youtube.LearningRESTAPI.service.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/exams")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;

    @GetMapping
    public ResponseEntity<List<Exam>> getAllExams() {
        return ResponseEntity.ok(examService.getAllExams());
    }

    @PostMapping
    public ResponseEntity<Exam> scheduleExam(@RequestBody Exam exam) {
        return ResponseEntity.ok(examService.scheduleExam(exam));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExam(@PathVariable Long id) {
        examService.deleteExam(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{examId}/results")
    public ResponseEntity<List<ExamResult>> getResults(@PathVariable Long examId) {
        return ResponseEntity.ok(examService.getResultsByExam(examId));
    }

    @PostMapping("/{examId}/results/{studentId}")
    public ResponseEntity<ExamResult> recordResult(
            @PathVariable Long examId,
            @PathVariable Long studentId,
            @RequestBody ExamResult result) {
        return ResponseEntity.ok(examService.recordResult(studentId, examId, result));
    }

    @PatchMapping("/{examId}/publish")
    public ResponseEntity<Void> publishResults(@PathVariable Long examId) {
        examService.publishResults(examId);
        return ResponseEntity.ok().build();
    }
}
