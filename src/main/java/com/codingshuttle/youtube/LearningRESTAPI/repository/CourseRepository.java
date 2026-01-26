package com.codingshuttle.youtube.LearningRESTAPI.repository;

import com.codingshuttle.youtube.LearningRESTAPI.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
}
