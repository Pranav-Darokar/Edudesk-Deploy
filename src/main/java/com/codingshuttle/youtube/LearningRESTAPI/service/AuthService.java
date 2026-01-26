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

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class AuthService {

        private final UserRepository repository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;
        private final EmailService emailService;
        private final PasswordResetTokenRepository tokenRepository;
        private final StudentRepository studentRepository;
        private final TeacherRepository teacherRepository;

        public AuthResponse signup(SignupRequest request) {
                log.info("Starting signup for email: {}", request.getEmail());

                if (repository.findByEmail(request.getEmail()).isPresent()) {
                        throw new RuntimeException("Email already registered");
                }

                var user = User.builder()
                                .name(request.getName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(request.getRole() != null ? request.getRole() : Role.STUDENT)
                                .build();
                User savedUser = repository.save(user);

                // Sync with management tables
                if (savedUser.getRole() == Role.STUDENT) {
                        com.codingshuttle.youtube.LearningRESTAPI.entity.Student student = new com.codingshuttle.youtube.LearningRESTAPI.entity.Student();
                        student.setName(savedUser.getName());
                        student.setEmail(savedUser.getEmail());
                        studentRepository.save(student);
                } else if (savedUser.getRole() == Role.TEACHER) {
                        com.codingshuttle.youtube.LearningRESTAPI.entity.Teacher teacher = new com.codingshuttle.youtube.LearningRESTAPI.entity.Teacher();
                        teacher.setName(savedUser.getName());
                        teacher.setEmail(savedUser.getEmail());
                        teacherRepository.save(teacher);
                }

                log.info("User and profile saved with id: {}", savedUser.getId());
                var jwtToken = jwtService.generateToken(savedUser);
                return AuthResponse.builder()
                                .token(jwtToken)
                                .build();
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

                String resetLink = "http://localhost:5173/reset-password?token=" + token;
                emailService.sendEmail(email, "Password Reset Request",
                                "Click the link below to reset your password:\n" + resetLink);
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
