package com.codingshuttle.youtube.LearningRESTAPI.dto;

import com.codingshuttle.youtube.LearningRESTAPI.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SignupRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phoneNumber;
    private String address;
    private String dob; // Keep as String for DTO, convert in Service
    private Role role;
}
