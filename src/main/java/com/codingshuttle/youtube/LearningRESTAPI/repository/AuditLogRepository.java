package com.codingshuttle.youtube.LearningRESTAPI.repository;

import com.codingshuttle.youtube.LearningRESTAPI.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findAllByOrderByTimestampDesc();
}
