package com.smartcart.dto;

import com.smartcart.entity.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CheckoutRequest {

    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;

    private String shippingCity;
    private String shippingState;
    private String shippingZip;

    @NotBlank(message = "Shipping phone is required")
    private String shippingPhone;

    private String notes;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    private String cardNumber;
    private String upiId;
}
