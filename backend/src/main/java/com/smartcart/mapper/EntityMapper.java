package com.smartcart.mapper;

import com.smartcart.dto.*;
import com.smartcart.entity.*;
import com.smartcart.repository.ProductRepository;
import com.smartcart.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class EntityMapper {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    public UserDto toUserDto(User user) {
        if (user == null) return null;
        return UserDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .enabled(user.getEnabled())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public CategoryDto toCategoryDto(Category category) {
        if (category == null) return null;
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .build();
    }

    public CategoryDto toCategoryDto(Category category, long productCount) {
        CategoryDto dto = toCategoryDto(category);
        if (dto != null) dto.setProductCount(productCount);
        return dto;
    }

    public ProductDto toProductDto(Product product) {
        if (product == null) return null;
        long reviewCount = reviewRepository.countByProductId(product.getId());
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .discount(product.getDiscount())
                .discountedPrice(product.getDiscountedPrice())
                .stock(product.getStock())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .imageUrl(product.getImageUrl())
                .rating(product.getRating())
                .reviewCount(reviewCount)
                .createdAt(product.getCreatedAt())
                .build();
    }

    public CartDto toCartDto(CartItem item) {
        if (item == null) return null;
        Product product = item.getProduct();
        BigDecimal discountedPrice = product.getDiscountedPrice();
        BigDecimal subtotal = discountedPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
        return CartDto.builder()
                .id(item.getId())
                .productId(product.getId())
                .productName(product.getName())
                .productImage(product.getImageUrl())
                .unitPrice(product.getPrice())
                .discount(product.getDiscount())
                .discountedPrice(discountedPrice)
                .quantity(item.getQuantity())
                .subtotal(subtotal)
                .stock(product.getStock())
                .build();
    }

    public WishlistDto toWishlistDto(WishlistItem item) {
        if (item == null) return null;
        Product product = item.getProduct();
        return WishlistDto.builder()
                .id(item.getId())
                .productId(product.getId())
                .productName(product.getName())
                .productImage(product.getImageUrl())
                .price(product.getPrice())
                .discount(product.getDiscount())
                .discountedPrice(product.getDiscountedPrice())
                .rating(product.getRating())
                .stock(product.getStock())
                .addedAt(item.getCreatedAt())
                .build();
    }

    public ReviewDto toReviewDto(Review review) {
        if (review == null) return null;
        return ReviewDto.builder()
                .id(review.getId())
                .productId(review.getProduct().getId())
                .userId(review.getUser().getId())
                .userName(review.getUser().getFirstName() + " " + review.getUser().getLastName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }

    public OrderDto toOrderDto(Order order) {
        if (order == null) return null;
        List<OrderItemDto> items = order.getItems().stream()
                .map(this::toOrderItemDto)
                .collect(Collectors.toList());

        OrderDto.OrderDtoBuilder builder = OrderDto.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .userId(order.getUser().getId())
                .userName(order.getUser().getFirstName() + " " + order.getUser().getLastName())
                .status(order.getStatus())
                .subtotal(order.getSubtotal())
                .discountAmount(order.getDiscountAmount())
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress())
                .shippingCity(order.getShippingCity())
                .shippingState(order.getShippingState())
                .shippingZip(order.getShippingZip())
                .shippingPhone(order.getShippingPhone())
                .notes(order.getNotes())
                .items(items)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt());

        if (order.getPayment() != null) {
            builder.paymentMethod(order.getPayment().getPaymentMethod())
                    .paymentStatus(order.getPayment().getStatus())
                    .transactionId(order.getPayment().getTransactionId());
        }

        return builder.build();
    }

    public OrderItemDto toOrderItemDto(OrderItem item) {
        if (item == null) return null;
        return OrderItemDto.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProductName())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .discount(item.getDiscount())
                .totalPrice(item.getTotalPrice())
                .build();
    }

    public <T> PageResponse<T> toPageResponse(org.springframework.data.domain.Page<T> page) {
        return PageResponse.<T>builder()
                .content(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }

    public void updateProductRating(Product product) {
        Double avgRating = reviewRepository.getAverageRating(product.getId());
        if (avgRating != null) {
            product.setRating(BigDecimal.valueOf(avgRating).setScale(2, RoundingMode.HALF_UP));
        } else {
            product.setRating(BigDecimal.ZERO);
        }
        productRepository.save(product);
    }
}
