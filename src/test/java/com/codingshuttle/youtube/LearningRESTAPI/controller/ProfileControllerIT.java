package com.codingshuttle.youtube.LearningRESTAPI.controller;

import com.codingshuttle.youtube.LearningRESTAPI.dto.ProfileCreateRequest;
import com.codingshuttle.youtube.LearningRESTAPI.entity.Profile;
import com.codingshuttle.youtube.LearningRESTAPI.entity.Role;
import com.codingshuttle.youtube.LearningRESTAPI.entity.User;
import com.codingshuttle.youtube.LearningRESTAPI.repository.ProfileRepository;
import com.codingshuttle.youtube.LearningRESTAPI.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ProfileControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        // Clean up
        profileRepository.deleteAll();
        userRepository.deleteAll();

        // Create a test user
        User user = User.builder()
                .firstName("Integration Test")
                .lastName("User")
                .email("it@example.com")
                .password(passwordEncoder.encode("password"))
                .role(Role.STUDENT)
                .enabled(true)
                .build();
        userRepository.save(user);

        // Manually set authentication
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(user, null,
                user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @AfterEach
    void tearDown() {
        profileRepository.deleteAll();
        userRepository.deleteAll();
        SecurityContextHolder.clearContext();
    }

    @Test
    void createProfile_Success() throws Exception {
        ProfileCreateRequest request = new ProfileCreateRequest("Bio from IT", "1234567890", "Test Address");

        mockMvc.perform(post("/api/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bio").value("Bio from IT"))
                .andExpect(jsonPath("$.email").value("it@example.com"));
    }

    @Test
    void getMyProfile_Success() throws Exception {
        // Pre-create profile
        User user = userRepository.findByEmail("it@example.com").orElseThrow();
        Profile profile = Profile.builder()
                .user(user)
                .bio("Existing Bio")
                .build();
        profileRepository.save(profile);

        mockMvc.perform(get("/api/profile/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bio").value("Existing Bio"));
    }
}
