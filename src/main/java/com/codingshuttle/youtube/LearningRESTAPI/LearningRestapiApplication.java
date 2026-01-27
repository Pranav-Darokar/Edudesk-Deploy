package com.codingshuttle.youtube.LearningRESTAPI;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class LearningRestapiApplication {

	public static void main(String[] args) {
		SpringApplication.run(LearningRestapiApplication.class, args);
	}

}
