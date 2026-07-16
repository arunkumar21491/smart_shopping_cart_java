package com.smartcart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal discount;
    private BigDecimal discountedPrice;
    private Integer stock;
    private Long categoryId;
    private String categoryName;
    private String imageUrl;
    private BigDecimal rating;
    private Long reviewCount;
    private LocalDateTime createdAt;
}
