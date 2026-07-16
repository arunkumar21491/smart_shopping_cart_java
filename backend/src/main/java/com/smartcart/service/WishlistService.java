package com.smartcart.service;

import com.smartcart.dto.CartDto;
import com.smartcart.dto.CartRequest;
import com.smartcart.dto.WishlistDto;
import com.smartcart.entity.Product;
import com.smartcart.entity.User;
import com.smartcart.entity.WishlistItem;
import com.smartcart.exception.BadRequestException;
import com.smartcart.exception.ResourceNotFoundException;
import com.smartcart.mapper.EntityMapper;
import com.smartcart.repository.WishlistRepository;
import com.smartcart.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductService productService;
    private final CartService cartService;
    private final SecurityUtils securityUtils;
    private final EntityMapper mapper;

    public List<WishlistDto> getWishlist() {
        User user = securityUtils.getCurrentUser();
        return wishlistRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(mapper::toWishlistDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public WishlistDto addToWishlist(Long productId) {
        User user = securityUtils.getCurrentUser();
        Product product = productService.findProductById(productId);

        if (wishlistRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            throw new BadRequestException("Product already in wishlist");
        }

        WishlistItem item = WishlistItem.builder()
                .user(user)
                .product(product)
                .build();

        return mapper.toWishlistDto(wishlistRepository.save(item));
    }

    @Transactional
    public void removeFromWishlist(Long productId) {
        User user = securityUtils.getCurrentUser();
        WishlistItem item = wishlistRepository.findByUserIdAndProductId(user.getId(), productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not in wishlist"));
        wishlistRepository.delete(item);
    }

    @Transactional
    public CartDto moveToCart(Long productId) {
        User user = securityUtils.getCurrentUser();
        WishlistItem item = wishlistRepository.findByUserIdAndProductId(user.getId(), productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not in wishlist"));

        CartRequest cartRequest = new CartRequest();
        cartRequest.setProductId(productId);
        cartRequest.setQuantity(1);

        CartDto cartDto = cartService.addToCart(cartRequest);
        wishlistRepository.delete(item);

        return cartDto;
    }
}
