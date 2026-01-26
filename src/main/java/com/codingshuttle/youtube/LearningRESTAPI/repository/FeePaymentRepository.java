package com.codingshuttle.youtube.LearningRESTAPI.repository;

import com.codingshuttle.youtube.LearningRESTAPI.entity.FeePayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeePaymentRepository extends JpaRepository<FeePayment, Long> {
    List<FeePayment> findByStudentId(Long studentId);
}
