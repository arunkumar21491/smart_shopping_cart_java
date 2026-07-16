package com.smartcart.controller;

import com.smartcart.dto.ApiResponse;
import com.smartcart.dto.ReviewDto;
import com.smartcart.dto.ReviewRequest;
import com.smartcart.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Product review management")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/product/{productId}")
    @Operation(summary = "Get all reviews for a product")
    public ResponseEntity<ApiResponse<List<ReviewDto>>> getProductReviews(@PathVariable Long productId) {
        List<ReviewDto> reviews = reviewService.getProductReviews(productId);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    @GetMapping("/product/{productId}/mine")
    @Operation(summary = "Get current user's review for a product")
    public ResponseEntity<ApiResponse<ReviewDto>> getMyReviewForProduct(@PathVariable Long productId) {
        ReviewDto review = reviewService.getMyReviewForProduct(productId);
        return ResponseEntity.ok(ApiResponse.success(review));
    }

    @PostMapping
    @Operation(summary = "Create a product review")
    public ResponseEntity<ApiResponse<ReviewDto>> createReview(@Valid @RequestBody ReviewRequest request) {
        ReviewDto review = reviewService.createReview(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Review submitted successfully", review));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing review")
    public ResponseEntity<ApiResponse<ReviewDto>> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequest request) {
        ReviewDto review = reviewService.updateReview(id, request);
        return ResponseEntity.ok(ApiResponse.success("Review updated successfully", review));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a review")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(ApiResponse.success("Review deleted successfully", null));
    }
}
