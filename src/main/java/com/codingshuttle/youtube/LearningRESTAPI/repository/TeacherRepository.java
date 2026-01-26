package com.codingshuttle.youtube.LearningRESTAPI.repository;

import com.codingshuttle.youtube.LearningRESTAPI.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
}
