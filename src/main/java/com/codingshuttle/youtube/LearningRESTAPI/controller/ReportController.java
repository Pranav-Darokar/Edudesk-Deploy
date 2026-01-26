package com.codingshuttle.youtube.LearningRESTAPI.controller;

import com.codingshuttle.youtube.LearningRESTAPI.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/admin/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/students/excel")
    public ResponseEntity<InputStreamResource> downloadStudentsExcel() {
        ByteArrayInputStream in = reportService.generateStudentsExcelReport();
        if (in == null)
            return ResponseEntity.internalServerError().build();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=students.xlsx");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(
                        MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }

    @GetMapping("/fees/pdf")
    public ResponseEntity<InputStreamResource> downloadFeesPdf() {
        ByteArrayInputStream in = reportService.generateFeesPdfReport();
        if (in == null)
            return ResponseEntity.internalServerError().build();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=fees_report.pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(in));
    }
}
