package com.codingshuttle.youtube.LearningRESTAPI.service;

import java.io.ByteArrayInputStream;

public interface ReportService {
    ByteArrayInputStream generateStudentsExcelReport();

    ByteArrayInputStream generateFeesPdfReport();

    ByteArrayInputStream generateExamsSummaryExcel();
}
