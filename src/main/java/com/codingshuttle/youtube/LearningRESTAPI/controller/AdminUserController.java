package com.codingshuttle.youtube.LearningRESTAPI.controller;

import com.codingshuttle.youtube.LearningRESTAPI.entity.Role;
import com.codingshuttle.youtube.LearningRESTAPI.entity.User;
import com.codingshuttle.youtube.LearningRESTAPI.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminUserService.getAllUsers());
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<User> updateUserRole(@PathVariable Long id, @RequestBody Map<String, Role> request) {
        return ResponseEntity.ok(adminUserService.updateUserRole(id, request.get("role")));
    }

    @PostMapping("/{id}/reset-password")
    public ResponseEntity<Void> administrativePasswordReset(@PathVariable Long id,
            @RequestBody Map<String, String> request) {
        adminUserService.resetUserPassword(id, request.get("newPassword"));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminUserService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
