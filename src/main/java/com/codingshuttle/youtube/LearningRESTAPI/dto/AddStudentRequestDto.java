package com.codingshuttle.youtube.LearningRESTAPI.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data

public class AddStudentRequestDto {

    @NotBlank(message = "Name is Required")
    @Size(min =3 ,max =30, message = "Name should be of 30 Charecter")
    private String name;
    @Email
    @NotBlank(message = "Email is required")
    private String email;


}
