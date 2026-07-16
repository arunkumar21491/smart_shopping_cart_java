package com.smartcart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartSummaryDto {
    private List<CartDto> items;
    private int itemCount;
    private BigDecimal subtotal;
    private BigDecimal discountAmount;
    private BigDecimal total;
}
