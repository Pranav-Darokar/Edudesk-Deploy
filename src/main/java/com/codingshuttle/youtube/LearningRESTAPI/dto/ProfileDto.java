package com.codingshuttle.youtube.LearningRESTAPI.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDto {
    private Long id; // Profile ID
    private Long userId;
    private String name;
    private String email;
    private String role;
    private String bio;
    private String phoneNumber;
    private String address;
    private java.time.LocalDate dob;
    private String profilePhotoUrl;
}
