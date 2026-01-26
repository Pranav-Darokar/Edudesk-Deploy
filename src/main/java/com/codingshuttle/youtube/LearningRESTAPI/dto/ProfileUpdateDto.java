package com.codingshuttle.youtube.LearningRESTAPI.dto;

import lombok.Data;

@Data
public class ProfileUpdateDto {
    private String name;
    private String email;
    private String currentPassword;
    private String newPassword;
}
