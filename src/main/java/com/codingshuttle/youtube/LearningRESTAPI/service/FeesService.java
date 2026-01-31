package com.codingshuttle.youtube.LearningRESTAPI.service;

import com.codingshuttle.youtube.LearningRESTAPI.entity.FeePayment;
import com.codingshuttle.youtube.LearningRESTAPI.entity.FeeStructure;

import java.util.List;

public interface FeesService {
    List<FeeStructure> getAllFeeStructures();

    FeeStructure createFeeStructure(FeeStructure feeStructure);

    FeeStructure updateFeeStructure(Long id, FeeStructure feeStructure);

    void deleteFeeStructure(Long id);

    List<FeePayment> getAllPayments();

    FeePayment collectPayment(Long studentId, Long feeStructureId, FeePayment payment);

    List<FeePayment> getStudentPayments(Long studentId);

    void deletePayment(Long id);
}
