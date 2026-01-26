package com.codingshuttle.youtube.LearningRESTAPI.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

@ControllerAdvice
@lombok.extern.slf4j.Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        log.error("Handling error: {}", ex.getMessage());
        String message = ex.getMessage();
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

        if ("Email already registered".equals(message)) {
            status = HttpStatus.CONFLICT;
        } else if (message.contains("not found")) {
            status = HttpStatus.NOT_FOUND;
        }

        return ResponseEntity.status(status).body(Map.of("error", message));
    }
}
