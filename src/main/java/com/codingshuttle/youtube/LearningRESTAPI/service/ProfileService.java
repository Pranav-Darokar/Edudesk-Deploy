package com.codingshuttle.youtube.LearningRESTAPI.service;

import com.codingshuttle.youtube.LearningRESTAPI.dto.ProfileCreateRequest;
import com.codingshuttle.youtube.LearningRESTAPI.dto.ProfileDto;
import com.codingshuttle.youtube.LearningRESTAPI.dto.ProfileUpdateRequest;
import com.codingshuttle.youtube.LearningRESTAPI.entity.User;

public interface ProfileService {
    ProfileDto createProfile(User user, ProfileCreateRequest request);

    ProfileDto getProfile(User user);

    ProfileDto updateProfile(User user, ProfileUpdateRequest request);
}
