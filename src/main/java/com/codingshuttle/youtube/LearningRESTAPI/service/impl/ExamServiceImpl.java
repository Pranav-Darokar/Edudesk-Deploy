package com.codingshuttle.youtube.LearningRESTAPI.service.impl;

import com.codingshuttle.youtube.LearningRESTAPI.entity.Exam;
import com.codingshuttle.youtube.LearningRESTAPI.entity.ExamResult;
import com.codingshuttle.youtube.LearningRESTAPI.repository.ExamRepository;
import com.codingshuttle.youtube.LearningRESTAPI.repository.ExamResultRepository;
import com.codingshuttle.youtube.LearningRESTAPI.repository.UserRepository;
import com.codingshuttle.youtube.LearningRESTAPI.service.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExamServiceImpl implements ExamService {

    private final ExamRepository examRepository;
    private final ExamResultRepository examResultRepository;
    private final UserRepository userRepository;

    @Override
    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    @Override
    public Exam scheduleExam(Exam exam) {
        return examRepository.save(exam);
    }

    @Override
    public void deleteExam(Long id) {
        examRepository.deleteById(id);
    }

    @Override
    public List<ExamResult> getResultsByExam(Long examId) {
        return examResultRepository.findByExamId(examId);
    }

    @Override
    public ExamResult recordResult(Long studentId, Long examId, ExamResult result) {
        var student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        var exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        result.setStudent(student);
        result.setExam(exam);
        result.setPublished(false);

        return examResultRepository.save(result);
    }

    @Override
    public void publishResults(Long examId) {
        var results = examResultRepository.findByExamId(examId);
        results.forEach(r -> r.setPublished(true));
        examResultRepository.saveAll(results);
    }

    @Override
    public List<ExamResult> getStudentResults(Long studentId) {
        return examResultRepository.findByStudentId(studentId);
    }
}
