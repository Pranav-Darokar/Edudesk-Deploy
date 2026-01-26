package com.codingshuttle.youtube.LearningRESTAPI.controller;

import com.codingshuttle.youtube.LearningRESTAPI.dto.ProfileCreateRequest;
import com.codingshuttle.youtube.LearningRESTAPI.dto.ProfileDto;
import com.codingshuttle.youtube.LearningRESTAPI.dto.ProfileUpdateRequest;
import com.codingshuttle.youtube.LearningRESTAPI.entity.User;
import com.codingshuttle.youtube.LearningRESTAPI.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @PostMapping
    public ResponseEntity<ProfileDto> createProfile(
            @AuthenticationPrincipal User user,
            @RequestBody ProfileCreateRequest request) {
        return ResponseEntity.ok(profileService.createProfile(user, request));
    }

    @GetMapping("/me")
    public ResponseEntity<ProfileDto> getMyProfile(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(profileService.getProfile(user));
    }

    @PatchMapping("/me")
    public ResponseEntity<ProfileDto> updateMyProfile(
            @AuthenticationPrincipal User user,
            @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(user, request));
    }
}
