package com.codingshuttle.youtube.LearningRESTAPI.controller;

import com.codingshuttle.youtube.LearningRESTAPI.entity.FeePayment;
import com.codingshuttle.youtube.LearningRESTAPI.entity.FeeStructure;
import com.codingshuttle.youtube.LearningRESTAPI.service.FeesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

@RestController
@RequestMapping("/admin/fees")
@RequiredArgsConstructor
public class FeesController {

    private final FeesService feesService;

    @GetMapping("/structures")
    public ResponseEntity<List<FeeStructure>> getAllStructures() {
        return ResponseEntity.ok(feesService.getAllFeeStructures());
    }

    @PostMapping("/structures")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<FeeStructure> createStructure(@RequestBody FeeStructure structure) {
        return ResponseEntity.ok(feesService.createFeeStructure(structure));
    }

    @DeleteMapping("/structures/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Void> deleteStructure(@PathVariable Long id) {
        feesService.deleteFeeStructure(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/payments")
    public ResponseEntity<List<FeePayment>> getAllPayments() {
        return ResponseEntity.ok(feesService.getAllPayments());
    }

    @PostMapping("/collect/{studentId}/{structureId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FeePayment> collectPayment(
            @PathVariable Long studentId,
            @PathVariable Long structureId,
            @RequestBody FeePayment payment) {
        return ResponseEntity.ok(feesService.collectPayment(studentId, structureId, payment));
    }
}
