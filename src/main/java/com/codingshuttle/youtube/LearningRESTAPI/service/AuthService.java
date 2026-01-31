package com.codingshuttle.youtube.LearningRESTAPI.service;

import com.codingshuttle.youtube.LearningRESTAPI.dto.AuthRequest;
import com.codingshuttle.youtube.LearningRESTAPI.dto.AuthResponse;
import com.codingshuttle.youtube.LearningRESTAPI.dto.SignupRequest;
import com.codingshuttle.youtube.LearningRESTAPI.entity.Role;
import com.codingshuttle.youtube.LearningRESTAPI.entity.User;
import com.codingshuttle.youtube.LearningRESTAPI.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import com.codingshuttle.youtube.LearningRESTAPI.dto.ResetPasswordRequest;
import com.codingshuttle.youtube.LearningRESTAPI.entity.PasswordResetToken;
import com.codingshuttle.youtube.LearningRESTAPI.repository.PasswordResetTokenRepository;
import com.codingshuttle.youtube.LearningRESTAPI.repository.StudentRepository;
import com.codingshuttle.youtube.LearningRESTAPI.repository.TeacherRepository;
import com.codingshuttle.youtube.LearningRESTAPI.repository.VerificationOTPRepository;
import com.codingshuttle.youtube.LearningRESTAPI.entity.VerificationOTP;
import com.codingshuttle.youtube.LearningRESTAPI.entity.Profile;
import com.codingshuttle.youtube.LearningRESTAPI.repository.ProfileRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class AuthService {

        @org.springframework.beans.factory.annotation.Value("${app.frontend.url}")
        private String frontendUrl;

        private final UserRepository repository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;
        private final EmailService emailService;
        private final PasswordResetTokenRepository tokenRepository;
        private final VerificationOTPRepository otpRepository;
        private final StudentRepository studentRepository;
        private final TeacherRepository teacherRepository;
        private final ProfileRepository profileRepository;

        public AuthResponse signup(SignupRequest request) {
                log.info("Starting signup for email: {}", request.getEmail());

                if (repository.findByEmail(request.getEmail()).isPresent()) {
                        throw new RuntimeException("Email already registered");
                }

                java.time.LocalDate dob = null;
                if (request.getDob() != null && !request.getDob().isEmpty()) {
                        dob = java.time.LocalDate.parse(request.getDob());
                }

                var user = User.builder()
                                .firstName(request.getFirstName())
                                .lastName(request.getLastName())
                                .email(request.getEmail())
                                .phoneNumber(request.getPhoneNumber())
                                .address(request.getAddress())
                                .dob(dob)
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(Role.STUDENT)
                                .enabled(true) // User is enabled immediately
                                .build();
                User savedUser = repository.save(user);

                // Generate token immediately
                var jwtToken = jwtService.generateToken(savedUser);

                // Generate and send OTP (optional now, but keeping the logic for background)
                String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
                Calendar cal = Calendar.getInstance();
                cal.add(Calendar.MINUTE, 10);

                VerificationOTP verificationOTP = VerificationOTP.builder()
                                .otp(otp)
                                .user(savedUser)
                                .expiryDate(cal.getTime())
                                .build();
                otpRepository.save(verificationOTP);

                try {
                        emailService.sendEmail(savedUser.getEmail(), "Verify your email",
                                        "Your verification code is: " + otp);
                } catch (Exception e) {
                        log.error("Failed to send verification email to {}: {}", savedUser.getEmail(), e.getMessage());
                }

                log.info("========================================");
                log.info("VERIFICATION OTP FOR {}: {}", savedUser.getEmail(), otp);
                log.info("========================================");

                // Sync with management tables
                if (savedUser.getRole() == Role.STUDENT) {
                        com.codingshuttle.youtube.LearningRESTAPI.entity.Student student = new com.codingshuttle.youtube.LearningRESTAPI.entity.Student();
                        student.setName(savedUser.getName());
                        student.setEmail(savedUser.getEmail());
                        studentRepository.save(student);
                }

                // Automatically create profile with signup data
                try {
                        Profile profile = Profile.builder()
                                        .user(savedUser)
                                        .bio("Welcome to EduDesk! Update your bio to tell us about yourself.")
                                        .phoneNumber(savedUser.getPhoneNumber())
                                        .address(savedUser.getAddress())
                                        .dob(savedUser.getDob())
                                        .build();
                        profileRepository.save(profile);
                        log.info("Profile automatically created for user: {}", savedUser.getEmail());
                } catch (Exception e) {
                        log.error("Failed to create profile for user {}: {}", savedUser.getEmail(), e.getMessage());
                }

                log.info("User saved with id: {}. Instant registration complete.", savedUser.getId());
                return AuthResponse.builder()
                                .token(jwtToken) // Return token for auto-login
                                .build();
        }

        public void verifyOtp(String email, String otp) {
                var otpEntity = otpRepository.findByOtpAndUser_Email(otp, email)
                                .orElseThrow(() -> new RuntimeException("Invalid OTP or Email"));

                if (otpEntity.isExpired()) {
                        throw new RuntimeException("OTP expired");
                }

                User user = otpEntity.getUser();
                user.setEnabled(true);
                repository.save(user);

                otpRepository.delete(otpEntity);
        }

        public AuthResponse login(AuthRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));
                var user = repository.findByEmail(request.getEmail())
                                .orElseThrow();
                var jwtToken = jwtService.generateToken(user);
                return AuthResponse.builder()
                                .token(jwtToken)
                                .build();
        }

        public void forgotPassword(String email) {
                var user = repository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                String token = UUID.randomUUID().toString();

                Calendar cal = Calendar.getInstance();
                cal.add(Calendar.HOUR, 1);

                var resetToken = PasswordResetToken.builder()
                                .token(token)
                                .user(user)
                                .expiryDate(cal.getTime())
                                .build();

                tokenRepository.save(resetToken);

                String resetLink = frontendUrl + "/reset-password?token=" + token;
                try {
                        emailService.sendEmail(email, "Password Reset Request",
                                        "Click the link below to reset your password:\n" + resetLink);
                } catch (Exception e) {
                        log.error("Failed to send password reset email to {}: {}", email, e.getMessage());
                }
        }

        public void resetPassword(ResetPasswordRequest request) {
                var resetToken = tokenRepository.findByToken(request.getToken())
                                .orElseThrow(() -> new RuntimeException("Invalid token"));

                if (resetToken.isExpired()) {
                        throw new RuntimeException("Token expired");
                }

                var user = resetToken.getUser();
                user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                repository.save(user);

                tokenRepository.delete(resetToken);
        }
}
