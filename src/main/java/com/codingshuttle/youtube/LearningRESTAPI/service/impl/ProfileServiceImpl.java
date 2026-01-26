package com.codingshuttle.youtube.LearningRESTAPI.service.impl;

import com.codingshuttle.youtube.LearningRESTAPI.dto.ProfileCreateRequest;
import com.codingshuttle.youtube.LearningRESTAPI.dto.ProfileDto;
import com.codingshuttle.youtube.LearningRESTAPI.dto.ProfileUpdateRequest;
import com.codingshuttle.youtube.LearningRESTAPI.entity.Profile;
import com.codingshuttle.youtube.LearningRESTAPI.entity.User;
import com.codingshuttle.youtube.LearningRESTAPI.repository.ProfileRepository;
import com.codingshuttle.youtube.LearningRESTAPI.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository profileRepository;

    @Override
    public ProfileDto createProfile(User user, ProfileCreateRequest request) {
        if (profileRepository.findByUserId(user.getId()).isPresent()) {
            throw new RuntimeException("Profile already exists");
        }
        Profile profile = Profile.builder()
                .user(user)
                .bio(request.getBio())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .build();
        return mapToDto(profileRepository.save(profile));
    }

    @Override
    public ProfileDto getProfile(User user) {
        return profileRepository.findByUserId(user.getId())
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    @Override
    public ProfileDto updateProfile(User user, ProfileUpdateRequest request) {
        Profile profile = profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        if (request.getBio() != null)
            profile.setBio(request.getBio());
        if (request.getPhoneNumber() != null)
            profile.setPhoneNumber(request.getPhoneNumber());
        if (request.getAddress() != null)
            profile.setAddress(request.getAddress());

        return mapToDto(profileRepository.save(profile));
    }

    private ProfileDto mapToDto(Profile profile) {
        return ProfileDto.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .name(profile.getUser().getName())
                .email(profile.getUser().getEmail())
                .role(profile.getUser().getRole().name())
                .bio(profile.getBio())
                .phoneNumber(profile.getPhoneNumber())
                .address(profile.getAddress())
                .build();
    }
}
