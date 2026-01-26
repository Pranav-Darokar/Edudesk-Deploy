package com.codingshuttle.youtube.LearningRESTAPI.repository;

import com.codingshuttle.youtube.LearningRESTAPI.entity.FeeStructure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeeStructureRepository extends JpaRepository<FeeStructure, Long> {
}
