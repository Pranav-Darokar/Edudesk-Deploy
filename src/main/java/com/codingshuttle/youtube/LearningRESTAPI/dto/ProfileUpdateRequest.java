package com.codingshuttle.youtube.LearningRESTAPI.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateRequest {
    private String bio;
    private String phoneNumber;
    private String address;
    private java.time.LocalDate dob;
    private String profilePhotoUrl;
}
