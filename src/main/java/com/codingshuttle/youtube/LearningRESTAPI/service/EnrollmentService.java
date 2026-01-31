package com.codingshuttle.youtube.LearningRESTAPI.service;

import com.codingshuttle.youtube.LearningRESTAPI.dto.CourseDto;
import java.util.List;

public interface EnrollmentService {
    void enrollStudent(Long courseId);

    List<CourseDto> getEnrolledCourses();
}
