package com.codingshuttle.youtube.LearningRESTAPI.service.impl;

import com.codingshuttle.youtube.LearningRESTAPI.entity.FeePayment;
import com.codingshuttle.youtube.LearningRESTAPI.entity.Student;
import com.codingshuttle.youtube.LearningRESTAPI.repository.FeePaymentRepository;
import com.codingshuttle.youtube.LearningRESTAPI.repository.StudentRepository;
import com.codingshuttle.youtube.LearningRESTAPI.service.ReportService;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final StudentRepository studentRepository;
    private final FeePaymentRepository feePaymentRepository;

    @Override
    public ByteArrayInputStream generateStudentsExcelReport() {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Students");

            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("ID");
            headerRow.createCell(1).setCellValue("Name");
            headerRow.createCell(2).setCellValue("Email");

            List<Student> students = studentRepository.findAll();
            int rowIdx = 1;
            for (Student student : students) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(student.getId());
                row.createCell(1).setCellValue(student.getName());
                row.createCell(2).setCellValue(student.getEmail());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate Excel report: " + e.getMessage());
        }
    }

    @Override
    public ByteArrayInputStream generateFeesPdfReport() {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        document.add(new Paragraph("Fees Collection Report").setBold().setFontSize(18));

        Table table = new Table(4);
        table.addCell("ID");
        table.addCell("Student");
        table.addCell("Amount");
        table.addCell("Date");

        List<FeePayment> payments = feePaymentRepository.findAll();
        for (FeePayment p : payments) {
            table.addCell(String.valueOf(p.getId()));
            table.addCell(p.getStudent().getName());
            table.addCell(String.valueOf(p.getAmountPaid()));
            table.addCell(p.getPaymentDate().toString());
        }

        document.add(table);
        document.close();

        return new ByteArrayInputStream(out.toByteArray());
    }

    @Override
    public ByteArrayInputStream generateExamsSummaryExcel() {
        // Similar implementation for Exams
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            workbook.createSheet("Exams");
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
