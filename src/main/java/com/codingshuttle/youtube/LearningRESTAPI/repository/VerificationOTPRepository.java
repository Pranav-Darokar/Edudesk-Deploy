package com.codingshuttle.youtube.LearningRESTAPI.repository;

import com.codingshuttle.youtube.LearningRESTAPI.entity.User;
import com.codingshuttle.youtube.LearningRESTAPI.entity.VerificationOTP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationOTPRepository extends JpaRepository<VerificationOTP, Long> {
    Optional<VerificationOTP> findByOtpAndUser_Email(String otp, String email);

    Optional<VerificationOTP> findByUser(User user);

    void deleteByUser(User user);
}
