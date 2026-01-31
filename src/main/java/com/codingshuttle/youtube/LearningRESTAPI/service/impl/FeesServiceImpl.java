package com.codingshuttle.youtube.LearningRESTAPI.service.impl;

import com.codingshuttle.youtube.LearningRESTAPI.entity.FeePayment;
import com.codingshuttle.youtube.LearningRESTAPI.entity.FeeStructure;
import com.codingshuttle.youtube.LearningRESTAPI.repository.FeePaymentRepository;
import com.codingshuttle.youtube.LearningRESTAPI.repository.FeeStructureRepository;
import com.codingshuttle.youtube.LearningRESTAPI.repository.UserRepository;
import com.codingshuttle.youtube.LearningRESTAPI.service.FeesService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FeesServiceImpl implements FeesService {

    private final FeeStructureRepository feeStructureRepository;
    private final FeePaymentRepository feePaymentRepository;
    private final UserRepository userRepository;

    @Override
    public List<FeeStructure> getAllFeeStructures() {
        return feeStructureRepository.findAll();
    }

    @Override
    public FeeStructure createFeeStructure(FeeStructure feeStructure) {
        return feeStructureRepository.save(feeStructure);
    }

    @Override
    public FeeStructure updateFeeStructure(Long id, FeeStructure feeStructure) {
        FeeStructure existing = feeStructureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fee structure not found"));
        existing.setClassName(feeStructure.getClassName());
        existing.setAmount(feeStructure.getAmount());
        existing.setDescription(feeStructure.getDescription());
        return feeStructureRepository.save(existing);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void deleteFeeStructure(Long id) {
        // Delete associated payments first
        feePaymentRepository.deleteByFeeStructureId(id);
        feeStructureRepository.deleteById(id);
    }

    @Override
    public List<FeePayment> getAllPayments() {
        return feePaymentRepository.findAll();
    }

    @Override
    public FeePayment collectPayment(Long studentId, Long feeStructureId, FeePayment payment) {
        var student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        var structure = feeStructureRepository.findById(feeStructureId)
                .orElseThrow(() -> new RuntimeException("Fee structure not found"));

        payment.setStudent(student);
        payment.setFeeStructure(structure);
        payment.setPaymentDate(LocalDateTime.now());

        return feePaymentRepository.save(payment);
    }

    @Override
    public List<FeePayment> getStudentPayments(Long studentId) {
        return feePaymentRepository.findByStudentId(studentId);
    }

    @Override
    public void deletePayment(Long id) {
        feePaymentRepository.deleteById(id);
    }
}
