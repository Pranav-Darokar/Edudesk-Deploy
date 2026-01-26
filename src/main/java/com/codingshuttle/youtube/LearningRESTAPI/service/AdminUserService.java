package com.codingshuttle.youtube.LearningRESTAPI.service;

import com.codingshuttle.youtube.LearningRESTAPI.entity.Role;
import com.codingshuttle.youtube.LearningRESTAPI.entity.User;

import java.util.List;

public interface AdminUserService {
    List<User> getAllUsers();

    User updateUserRole(Long id, Role role);

    void resetUserPassword(Long id, String newPassword);

    void deleteUser(Long id);
}
