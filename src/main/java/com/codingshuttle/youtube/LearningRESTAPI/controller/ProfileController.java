package com.codingshuttle.youtube.LearningRESTAPI.controller;

import com.codingshuttle.youtube.LearningRESTAPI.dto.ProfileCreateRequest;
import com.codingshuttle.youtube.LearningRESTAPI.dto.ProfileDto;
import com.codingshuttle.youtube.LearningRESTAPI.dto.ProfileUpdateRequest;
import com.codingshuttle.youtube.LearningRESTAPI.entity.User;
import com.codingshuttle.youtube.LearningRESTAPI.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/profile")
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
        log.info("=== GET /api/profile/me called ===");
        log.info("User: {} (ID: {})", user.getEmail(), user.getId());

        log.info("Calling profileService.getProfile()...");
        ProfileDto profile = profileService.getProfile(user);

        log.info("Profile returned: {}", profile != null ? "FOUND" : "NULL");
        if (profile == null) {
            log.warn("Returning 404 - profile is null");
            return ResponseEntity.notFound().build();
        }
        log.info("Returning 200 with profile data");
        return ResponseEntity.ok(profile);
    }

    @PatchMapping("/me")
    public ResponseEntity<ProfileDto> updateMyProfile(
            @AuthenticationPrincipal User user,
            @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(user, request));
    }
}
