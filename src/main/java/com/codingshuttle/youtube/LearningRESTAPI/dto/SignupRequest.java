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
    private String name;
    private String email;
    private String password;
    private Role role;
}
