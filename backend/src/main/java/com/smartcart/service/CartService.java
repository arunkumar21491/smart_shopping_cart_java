package com.smartcart.service;

import com.smartcart.dto.CartDto;
import com.smartcart.dto.CartRequest;
import com.smartcart.dto.CartSummaryDto;
import com.smartcart.entity.CartItem;
import com.smartcart.entity.Product;
import com.smartcart.entity.User;
import com.smartcart.exception.BadRequestException;
import com.smartcart.exception.ResourceNotFoundException;
import com.smartcart.mapper.EntityMapper;
import com.smartcart.repository.CartItemRepository;
import com.smartcart.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductService productService;
    private final SecurityUtils securityUtils;
    private final EntityMapper mapper;

    public CartSummaryDto getCart() {
        User user = securityUtils.getCurrentUser();
        List<CartItem> items = cartItemRepository.findByUserId(user.getId());
        return buildCartSummary(items);
    }

    @Transactional
    public CartDto addToCart(CartRequest request) {
        User user = securityUtils.getCurrentUser();
        Product product = productService.findProductById(request.getProductId());

        if (product.getStock() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock. Available: " + product.getStock());
        }

        CartItem cartItem = cartItemRepository.findByUserIdAndProductId(user.getId(), product.getId())
                .orElse(null);

        if (cartItem != null) {
            int newQty = cartItem.getQuantity() + request.getQuantity();
            if (newQty > product.getStock()) {
                throw new BadRequestException("Insufficient stock. Available: " + product.getStock());
            }
            cartItem.setQuantity(newQty);
        } else {
            cartItem = CartItem.builder()
                    .user(user)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
        }

        return mapper.toCartDto(cartItemRepository.save(cartItem));
    }

    @Transactional
    public CartDto updateQuantity(Long cartItemId, Integer quantity) {
        if (quantity < 1) {
            throw new BadRequestException("Quantity must be at least 1");
        }

        User user = securityUtils.getCurrentUser();
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Cart item does not belong to current user");
        }

        if (quantity > cartItem.getProduct().getStock()) {
            throw new BadRequestException("Insufficient stock. Available: " + cartItem.getProduct().getStock());
        }

        cartItem.setQuantity(quantity);
        return mapper.toCartDto(cartItemRepository.save(cartItem));
    }

    @Transactional
    public void removeFromCart(Long cartItemId) {
        User user = securityUtils.getCurrentUser();
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Cart item does not belong to current user");
        }

        cartItemRepository.delete(cartItem);
    }

    @Transactional
    public void clearCart() {
        User user = securityUtils.getCurrentUser();
        cartItemRepository.deleteByUserId(user.getId());
    }

    public CartSummaryDto getCartForUser(User user) {
        List<CartItem> items = cartItemRepository.findByUserId(user.getId());
        return buildCartSummary(items);
    }

    private CartSummaryDto buildCartSummary(List<CartItem> items) {
        List<CartDto> cartDtos = items.stream()
                .map(mapper::toCartDto)
                .collect(Collectors.toList());

        BigDecimal subtotal = cartDtos.stream()
                .map(CartDto::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal originalTotal = items.stream()
                .map(item -> item.getProduct().getPrice()
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal discountAmount = originalTotal.subtract(subtotal);

        return CartSummaryDto.builder()
                .items(cartDtos)
                .itemCount(cartDtos.size())
                .subtotal(originalTotal)
                .discountAmount(discountAmount)
                .total(subtotal)
                .build();
    }
}
