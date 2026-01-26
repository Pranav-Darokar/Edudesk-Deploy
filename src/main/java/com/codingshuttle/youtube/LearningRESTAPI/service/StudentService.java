package com.codingshuttle.youtube.LearningRESTAPI.service;

import com.codingshuttle.youtube.LearningRESTAPI.dto.AddStudentRequestDto;
import com.codingshuttle.youtube.LearningRESTAPI.dto.StudentDto;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Map;

public interface StudentService {

  List<StudentDto> getAllStudents();

  Page<StudentDto> getAllStudents(Pageable pageable);

  StudentDto getStudentById(Long id);

  StudentDto createNewStudent(AddStudentRequestDto addStudentRequestDto);

  void deleteStudentById(Long id);

  StudentDto updateStudent(Long id, AddStudentRequestDto addStudentRequestDto);

  StudentDto updatePartialStudent(Long id, Map<String, Object> updates);
}
