package com.codingshuttle.youtube.LearningRESTAPI.service;

import com.codingshuttle.youtube.LearningRESTAPI.dto.ProfileCreateRequest;
import com.codingshuttle.youtube.LearningRESTAPI.dto.ProfileDto;
import com.codingshuttle.youtube.LearningRESTAPI.dto.ProfileUpdateRequest;
import com.codingshuttle.youtube.LearningRESTAPI.entity.Profile;
import com.codingshuttle.youtube.LearningRESTAPI.entity.Role;
import com.codingshuttle.youtube.LearningRESTAPI.entity.User;
import com.codingshuttle.youtube.LearningRESTAPI.repository.ProfileRepository;
import com.codingshuttle.youtube.LearningRESTAPI.service.impl.ProfileServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ProfileServiceTest {

    @Mock
    private ProfileRepository profileRepository;

    @InjectMocks
    private ProfileServiceImpl profileService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockUser = User.builder()
                .id(1L)
                .firstName("Test")
                .lastName("User")
                .email("test@example.com")
                .role(Role.STUDENT)
                .enabled(true)
                .build();
    }

    @Test
    void createProfile_Success() {
        ProfileCreateRequest request = ProfileCreateRequest.builder()
                .bio("Bio")
                .phoneNumber("123")
                .address("Address")
                .build();
        when(profileRepository.findByUserId(1L)).thenReturn(Optional.empty());
        when(profileRepository.save(any(Profile.class))).thenAnswer(i -> {
            Profile p = i.getArgument(0);
            p.setId(10L);
            return p;
        });

        ProfileDto result = profileService.createProfile(mockUser, request);

        assertNotNull(result);
        assertEquals("Bio", result.getBio());
        assertEquals(10L, result.getId());
        verify(profileRepository).save(any(Profile.class));
    }

    @Test
    void getProfile_Success() {
        Profile profile = Profile.builder().id(10L).user(mockUser).bio("Bio").build();
        when(profileRepository.findByUserId(1L)).thenReturn(Optional.of(profile));

        ProfileDto result = profileService.getProfile(mockUser);

        assertNotNull(result);
        assertEquals("Bio", result.getBio());
    }

    @Test
    void updateProfile_Success() {
        Profile profile = Profile.builder().id(10L).user(mockUser).bio("Old Bio").build();
        ProfileUpdateRequest request = ProfileUpdateRequest.builder()
                .bio("New Bio")
                .build();

        when(profileRepository.findByUserId(1L)).thenReturn(Optional.of(profile));
        when(profileRepository.save(any(Profile.class))).thenAnswer(i -> i.getArgument(0));

        ProfileDto result = profileService.updateProfile(mockUser, request);

        assertNotNull(result);
        assertEquals("New Bio", result.getBio());
    }
}
