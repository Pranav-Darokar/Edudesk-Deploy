package com.codingshuttle.youtube.LearningRESTAPI.controller;

import com.codingshuttle.youtube.LearningRESTAPI.entity.AuditLog;
import com.codingshuttle.youtube.LearningRESTAPI.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/system")
@RequiredArgsConstructor
public class SystemController {

    private final AuditLogRepository auditLogRepository;

    @GetMapping("/logs")
    public ResponseEntity<List<AuditLog>> getLogs() {
        return ResponseEntity.ok(auditLogRepository.findAllByOrderByTimestampDesc());
    }

    @GetMapping("/settings")
    public ResponseEntity<Map<String, String>> getSettings() {
        return ResponseEntity.ok(Map.of(
                "siteName", "Student Management System",
                "version", "1.0.0-PRO",
                "footerText", "© 2024 SMS Portal. All rights reserved."));
    }

    @PostMapping("/settings")
    public ResponseEntity<Void> updateSettings(@RequestBody Map<String, String> settings) {
        // In a real app, save these to a Settings entity
        return ResponseEntity.ok().build();
    }
}
