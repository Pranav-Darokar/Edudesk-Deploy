package com.codingshuttle.youtube.LearningRESTAPI.controller;

import com.codingshuttle.youtube.LearningRESTAPI.dto.TeacherDto;
import com.codingshuttle.youtube.LearningRESTAPI.service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;

    @GetMapping
    public ResponseEntity<Page<TeacherDto>> getAllTeachers(Pageable pageable) {
        return ResponseEntity.ok(teacherService.getAllTeachers(pageable));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TeacherDto> createTeacher(@RequestBody TeacherDto teacherDto) {
        return ResponseEntity.ok(teacherService.createTeacher(teacherDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeacherDto> getTeacherById(@PathVariable Long id) {
        return ResponseEntity.ok(teacherService.getTeacherById(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTeacher(@PathVariable Long id) {
        teacherService.deleteTeacher(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeacherDto> updateTeacher(@PathVariable Long id, @RequestBody TeacherDto teacherDto) {
        return ResponseEntity.ok(teacherService.updateTeacher(id, teacherDto));
    }
}
