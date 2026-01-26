package com.codingshuttle.youtube.LearningRESTAPI.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherDto {
    private Long id;
    private String name;
    private String email;
    private String subject;
    private String experience;
}
