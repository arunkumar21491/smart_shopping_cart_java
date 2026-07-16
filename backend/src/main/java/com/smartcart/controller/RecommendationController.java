package com.smartcart.controller;

import com.smartcart.dto.ApiResponse;
import com.smartcart.dto.ProductDto;
import com.smartcart.service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recommendations")
@RequiredArgsConstructor
@Tag(name = "Recommendations", description = "Product recommendations and discovery")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/most-purchased")
    @Operation(summary = "Get most purchased products")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getMostPurchased() {
        List<ProductDto> products = recommendationService.getMostPurchased();
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/trending")
    @Operation(summary = "Get trending products")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getTrending() {
        List<ProductDto> products = recommendationService.getTrending();
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/similar/{productId}")
    @Operation(summary = "Get products similar to the given product")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getSimilarProducts(@PathVariable Long productId) {
        List<ProductDto> products = recommendationService.getSimilarProducts(productId);
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/recently-viewed")
    @Operation(summary = "Get recently viewed products for the current user")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getRecentlyViewed() {
        List<ProductDto> products = recommendationService.getRecentlyViewed();
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @PostMapping("/view/{productId}")
    @Operation(summary = "Record a product view for recommendations")
    public ResponseEntity<ApiResponse<Void>> recordProductView(@PathVariable Long productId) {
        recommendationService.recordProductView(productId);
        return ResponseEntity.ok(ApiResponse.success("Product view recorded", null));
    }
}
