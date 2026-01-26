package com.codingshuttle.youtube.LearningRESTAPI.service;

import com.codingshuttle.youtube.LearningRESTAPI.dto.CourseDto;
import com.codingshuttle.youtube.LearningRESTAPI.entity.Course;
import com.codingshuttle.youtube.LearningRESTAPI.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final ModelMapper modelMapper;

    public List<CourseDto> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .map(course -> modelMapper.map(course, CourseDto.class))
                .collect(Collectors.toList());
    }

    public CourseDto createCourse(CourseDto courseDto) {
        Course course = modelMapper.map(courseDto, Course.class);
        Course savedCourse = courseRepository.save(course);
        return modelMapper.map(savedCourse, CourseDto.class);
    }

    public CourseDto getCourseById(Long id) {
        Course course = courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
        return modelMapper.map(course, CourseDto.class);
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    public CourseDto updateCourse(Long id, CourseDto courseDto) {
        Course course = courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
        course.setTitle(courseDto.getTitle());
        course.setDescription(courseDto.getDescription());
        course.setDuration(courseDto.getDuration());
        Course updatedCourse = courseRepository.save(course);
        return modelMapper.map(updatedCourse, CourseDto.class);
    }
}
