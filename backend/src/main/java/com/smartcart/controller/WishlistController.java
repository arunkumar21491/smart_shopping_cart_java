package com.smartcart.controller;

import com.smartcart.dto.ApiResponse;
import com.smartcart.dto.CartDto;
import com.smartcart.dto.WishlistDto;
import com.smartcart.service.WishlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
@RequiredArgsConstructor
@Tag(name = "Wishlist", description = "Wishlist management")
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    @Operation(summary = "Get current user's wishlist")
    public ResponseEntity<ApiResponse<List<WishlistDto>>> getWishlist() {
        List<WishlistDto> wishlist = wishlistService.getWishlist();
        return ResponseEntity.ok(ApiResponse.success(wishlist));
    }

    @PostMapping("/{productId}")
    @Operation(summary = "Add a product to the wishlist")
    public ResponseEntity<ApiResponse<WishlistDto>> addToWishlist(@PathVariable Long productId) {
        WishlistDto item = wishlistService.addToWishlist(productId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product added to wishlist", item));
    }

    @DeleteMapping("/{productId}")
    @Operation(summary = "Remove a product from the wishlist")
    public ResponseEntity<ApiResponse<Void>> removeFromWishlist(@PathVariable Long productId) {
        wishlistService.removeFromWishlist(productId);
        return ResponseEntity.ok(ApiResponse.success("Product removed from wishlist", null));
    }

    @PostMapping("/{productId}/move-to-cart")
    @Operation(summary = "Move a wishlist item to the cart")
    public ResponseEntity<ApiResponse<CartDto>> moveToCart(@PathVariable Long productId) {
        CartDto cartItem = wishlistService.moveToCart(productId);
        return ResponseEntity.ok(ApiResponse.success("Product moved to cart", cartItem));
    }
}
