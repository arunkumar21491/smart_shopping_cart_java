package com.smartcart.controller;

import com.smartcart.dto.ApiResponse;
import com.smartcart.dto.CartDto;
import com.smartcart.dto.CartRequest;
import com.smartcart.dto.CartSummaryDto;
import com.smartcart.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "Shopping cart operations")
public class CartController {

    private final CartService cartService;

    @GetMapping
    @Operation(summary = "Get current user's cart with summary")
    public ResponseEntity<ApiResponse<CartSummaryDto>> getCart() {
        CartSummaryDto cart = cartService.getCart();
        return ResponseEntity.ok(ApiResponse.success(cart));
    }

    @PostMapping
    @Operation(summary = "Add a product to the cart")
    public ResponseEntity<ApiResponse<CartDto>> addToCart(@Valid @RequestBody CartRequest request) {
        CartDto item = cartService.addToCart(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product added to cart", item));
    }

    @PutMapping("/{cartItemId}")
    @Operation(summary = "Update quantity of a cart item")
    public ResponseEntity<ApiResponse<CartDto>> updateQuantity(
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity) {
        CartDto item = cartService.updateQuantity(cartItemId, quantity);
        return ResponseEntity.ok(ApiResponse.success("Cart item updated", item));
    }

    @DeleteMapping("/{cartItemId}")
    @Operation(summary = "Remove an item from the cart")
    public ResponseEntity<ApiResponse<Void>> removeFromCart(@PathVariable Long cartItemId) {
        cartService.removeFromCart(cartItemId);
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart", null));
    }

    @DeleteMapping
    @Operation(summary = "Clear all items from the cart")
    public ResponseEntity<ApiResponse<Void>> clearCart() {
        cartService.clearCart();
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", null));
    }
}
