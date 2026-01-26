package com.codingshuttle.youtube.LearningRESTAPI.controller;

import com.codingshuttle.youtube.LearningRESTAPI.dto.AuthRequest;
import com.codingshuttle.youtube.LearningRESTAPI.dto.AuthResponse;
import com.codingshuttle.youtube.LearningRESTAPI.dto.SignupRequest;
import com.codingshuttle.youtube.LearningRESTAPI.dto.ResetPasswordRequest;
import com.codingshuttle.youtube.LearningRESTAPI.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(
            @RequestBody SignupRequest request) {
        return ResponseEntity.ok(service.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody AuthRequest request) {
        return ResponseEntity.ok(service.login(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@RequestBody Map<String, String> request) {
        service.forgotPassword(request.get("email"));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestBody ResetPasswordRequest request) {
        service.resetPassword(request);
        return ResponseEntity.ok().build();
    }
}
