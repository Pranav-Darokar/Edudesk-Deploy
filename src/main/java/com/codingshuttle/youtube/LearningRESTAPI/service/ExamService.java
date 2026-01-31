package com.codingshuttle.youtube.LearningRESTAPI.service;

import com.codingshuttle.youtube.LearningRESTAPI.entity.Exam;
import com.codingshuttle.youtube.LearningRESTAPI.entity.ExamResult;

import java.util.List;

public interface ExamService {
    List<Exam> getAllExams();

    Exam scheduleExam(Exam exam);

    Exam updateExam(Long id, Exam exam);

    void deleteExam(Long id);

    List<ExamResult> getResultsByExam(Long examId);

    ExamResult recordResult(Long studentId, Long examId, ExamResult result);

    void publishResults(Long examId);

    List<ExamResult> getStudentResults(Long studentId);
}
