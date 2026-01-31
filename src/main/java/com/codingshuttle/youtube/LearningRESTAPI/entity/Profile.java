package com.codingshuttle.youtube.LearningRESTAPI.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, unique = true)
    private User user;

    // Example profile fields – can be extended as needed
    private String bio;
    private String phoneNumber;
    private String address;
    private java.time.LocalDate dob;

    @Column(columnDefinition = "TEXT")
    private String profilePhotoUrl;
}
