package com.codingshuttle.youtube.LearningRESTAPI.config;

import com.codingshuttle.youtube.LearningRESTAPI.entity.*;
import com.codingshuttle.youtube.LearningRESTAPI.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final ExamRepository examRepository;
    private final AttendanceRepository attendanceRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final TeacherRepository teacherRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initializeData() {
        return args -> {
            // Admin
            String adminEmail = "admin@edudesk.com";
            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                log.info("No admin user found. Creating default admin user.");
                User admin = User.builder()
                        .firstName("Admin")
                        .lastName("User")
                        .email(adminEmail)
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .enabled(true)
                        .build();
                userRepository.save(admin);
                log.info("Default admin user created: {}", adminEmail);
            } else {
                log.info("Admin user already exists.");
            }

            // Ensure Admin Profile Exists
            User admin = userRepository.findByEmail(adminEmail).orElseThrow();
            if (profileRepository.findByUserId(admin.getId()).isEmpty()) {
                Profile adminProfile = Profile.builder()
                        .user(admin)
                        .bio("System Administrator")
                        .phoneNumber("000-000-0000")
                        .address("Admin HQ")
                        .dob(LocalDate.of(1980, 1, 1))
                        .build();
                profileRepository.save(adminProfile);
                log.info("Admin profile seeded.");
            }

            seedTeachersAndCourses();
            seedStudents();
            seedExams();
        };
    }

    private void seedTeachersAndCourses() {
        // 1. Ensure Teachers Exist
        if (teacherRepository.count() == 0) {
            // Create 10 Teachers
            for (int i = 1; i <= 10; i++) {
                Teacher t = Teacher.builder()
                        .name("Teacher " + i)
                        .email("teacher" + i + "@edudesk.com")
                        .subject("Subject " + i)
                        .experience((i + 5) + " years")
                        .build();
                teacherRepository.save(t);
            }
            log.info("10 Teachers seeded.");
        }

        // 2. Fetch Teachers for assignment
        java.util.List<Teacher> teachers = teacherRepository.findAll();
        if (teachers.isEmpty())
            return; // Should not happen after above block

        // 3. Ensure Courses have Teachers
        java.util.List<Course> courses = courseRepository.findAll();
        if (courses.isEmpty()) {
            // Create 10 Courses
            String[] subjects = { "Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "History",
                    "Geography", "English", "Art", "Music" };

            for (int i = 0; i < 10; i++) {
                Teacher teacher = teachers.get(i % teachers.size());
                Course c = Course.builder()
                        .title(subjects[i] + " " + (101 + i))
                        .description("Introduction to " + subjects[i])
                        .duration(10 + i)
                        .teacher(teacher)
                        .build();
                courseRepository.save(c);
            }
            log.info("10 Courses seeded with teachers.");
        } else {
            // Update existing courses
            boolean updated = false;
            for (Course c : courses) {
                if (c.getTeacher() == null) {
                    Teacher randomTeacher = teachers.get((int) (Math.random() * teachers.size()));
                    c.setTeacher(randomTeacher);
                    courseRepository.save(c);
                    updated = true;
                }
            }
            if (updated)
                log.info("Existing courses updated with teachers.");
        }
    }

    private void seedStudents() {
        if (userRepository.findByEmail("student1@edudesk.com").isEmpty()) {
            log.info("Seeding students...");
            createStudent("John", "Doe", "student1@edudesk.com");
            createStudent("Jane", "Smith", "student2@edudesk.com");
            log.info("Students seeded.");
        }
    }

    private void createStudent(String first, String last, String email) {
        User user = User.builder()
                .firstName(first)
                .lastName(last)
                .email(email)
                .password(passwordEncoder.encode("password")) // Default password
                .role(Role.STUDENT)
                .enabled(true)
                .build();
        userRepository.save(user);

        Student student = new Student();
        student.setName(first + " " + last);
        student.setEmail(email);
        studentRepository.save(student);

        // Seed Attendance for this student
        Attendance attendance = Attendance.builder()
                .student(user)
                .date(LocalDate.now())
                .present(true)
                .remarks("First day")
                .build();
        attendanceRepository.save(attendance);
    }

    private void seedExams() {
        if (examRepository.count() == 0) {
            log.info("Seeding exams...");
            Exam e1 = Exam.builder().title("Midterm Math").subject("Mathematics 101")
                    .examDate(LocalDateTime.now().plusDays(5)).totalMarks(100).durationMinutes(90).build();
            Exam e2 = Exam.builder().title("Final Physics").subject("Physics 101")
                    .examDate(LocalDateTime.now().plusWeeks(2)).totalMarks(100).durationMinutes(120).build();
            examRepository.save(e1);
            examRepository.save(e2);
            log.info("Exams seeded.");
        }
    }
}
