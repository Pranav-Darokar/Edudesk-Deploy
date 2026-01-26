package com.codingshuttle.youtube.LearningRESTAPI.service;

import com.codingshuttle.youtube.LearningRESTAPI.dto.TeacherDto;
import com.codingshuttle.youtube.LearningRESTAPI.entity.Teacher;
import com.codingshuttle.youtube.LearningRESTAPI.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final ModelMapper modelMapper;

    public List<TeacherDto> getAllTeachers() {
        return teacherRepository.findAll()
                .stream()
                .map(teacher -> modelMapper.map(teacher, TeacherDto.class))
                .collect(Collectors.toList());
    }

    public Page<TeacherDto> getAllTeachers(Pageable pageable) {
        return teacherRepository.findAll(pageable)
                .map(teacher -> modelMapper.map(teacher, TeacherDto.class));
    }

    public TeacherDto createTeacher(TeacherDto teacherDto) {
        Teacher teacher = modelMapper.map(teacherDto, Teacher.class);
        Teacher savedTeacher = teacherRepository.save(teacher);
        return modelMapper.map(savedTeacher, TeacherDto.class);
    }

    public TeacherDto getTeacherById(Long id) {
        Teacher teacher = teacherRepository.findById(id).orElseThrow(() -> new RuntimeException("Teacher not found"));
        return modelMapper.map(teacher, TeacherDto.class);
    }

    public void deleteTeacher(Long id) {
        teacherRepository.deleteById(id);
    }

    public TeacherDto updateTeacher(Long id, TeacherDto teacherDto) {
        Teacher teacher = teacherRepository.findById(id).orElseThrow(() -> new RuntimeException("Teacher not found"));
        teacher.setName(teacherDto.getName());
        teacher.setEmail(teacherDto.getEmail());
        teacher.setSubject(teacherDto.getSubject());
        teacher.setExperience(teacherDto.getExperience());
        Teacher updatedTeacher = teacherRepository.save(teacher);
        return modelMapper.map(updatedTeacher, TeacherDto.class);
    }
}
