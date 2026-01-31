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

            seedTeachersAndCourses();
            seedStudents();
            seedExams();
        };
    }

    private void seedTeachersAndCourses() {
        // 1. Ensure Teachers Exist
        if (teacherRepository.count() == 0) {
            log.info("Seeding teachers...");
            Teacher t1 = Teacher.builder().name("Dr. C.V. Raman").email("raman@edudesk.com").subject("Physics")
                    .experience("15 years").build();
            Teacher t2 = Teacher.builder().name("Dr. APJ Abdul Kalam").email("kalam@edudesk.com")
                    .subject("Aeronautics").experience("20 years").build();
            Teacher t3 = Teacher.builder().name("Srinivasa Ramanujan").email("ramanujan@edudesk.com")
                    .subject("Mathematics").experience("10 years").build();

            teacherRepository.save(t1);
            teacherRepository.save(t2);
            teacherRepository.save(t3);
            log.info("Teachers seeded.");
        }

        // 2. Fetch Teachers for assignment
        java.util.List<Teacher> teachers = teacherRepository.findAll();
        if (teachers.isEmpty())
            return; // Should not happen after above block

        Teacher t1 = teachers.stream().filter(t -> t.getSubject().equals("Physics")).findFirst()
                .orElse(teachers.get(0));
        Teacher t2 = teachers.stream().filter(t -> t.getSubject().equals("Aeronautics")).findFirst()
                .orElse(teachers.get(0));
        Teacher t3 = teachers.stream().filter(t -> t.getSubject().equals("Mathematics")).findFirst()
                .orElse(teachers.get(0));

        // 3. Ensure Courses have Teachers
        java.util.List<Course> courses = courseRepository.findAll();
        if (courses.isEmpty()) {
            // Create default courses if none exist
            Course c1 = Course.builder().title("Mathematics 101").description("Introduction to basic mathematics")
                    .duration(12).teacher(t3).build();
            Course c2 = Course.builder().title("Physics 101").description("Introduction to physics principles")
                    .duration(14).teacher(t1).build();
            Course c3 = Course.builder().title("Computer Science A").description("Basics of programming").duration(10)
                    .teacher(t2).build();

            courseRepository.save(c1);
            courseRepository.save(c2);
            courseRepository.save(c3);
            log.info("Courses seeded with teachers.");
        } else {
            // Update existing courses
            boolean updated = false;
            for (Course c : courses) {
                if (c.getTeacher() == null) {
                    if (c.getTitle().contains("Math"))
                        c.setTeacher(t3);
                    else if (c.getTitle().contains("Physics"))
                        c.setTeacher(t1);
                    else
                        c.setTeacher(t2);
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
