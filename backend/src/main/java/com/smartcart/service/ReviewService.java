package com.smartcart.service;

import com.smartcart.dto.ReviewDto;
import com.smartcart.dto.ReviewRequest;
import com.smartcart.entity.Product;
import com.smartcart.entity.Review;
import com.smartcart.entity.User;
import com.smartcart.exception.BadRequestException;
import com.smartcart.exception.ResourceNotFoundException;
import com.smartcart.mapper.EntityMapper;
import com.smartcart.repository.ReviewRepository;
import com.smartcart.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductService productService;
    private final SecurityUtils securityUtils;
    private final EntityMapper mapper;

    public List<ReviewDto> getProductReviews(Long productId) {
        productService.findProductById(productId);
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(mapper::toReviewDto)
                .collect(Collectors.toList());
    }

    public ReviewDto getMyReviewForProduct(Long productId) {
        User user = securityUtils.getCurrentUser();
        Review review = reviewRepository.findByUserIdAndProductId(user.getId(), productId)
                .orElse(null);
        return review != null ? mapper.toReviewDto(review) : null;
    }

    @Transactional
    public ReviewDto createReview(ReviewRequest request) {
        User user = securityUtils.getCurrentUser();
        Product product = productService.findProductById(request.getProductId());

        if (reviewRepository.findByUserIdAndProductId(user.getId(), product.getId()).isPresent()) {
            throw new BadRequestException("You have already reviewed this product");
        }

        Review review = Review.builder()
                .user(user)
                .product(product)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        review = reviewRepository.save(review);
        mapper.updateProductRating(product);

        return mapper.toReviewDto(review);
    }

    @Transactional
    public ReviewDto updateReview(Long id, ReviewRequest request) {
        User user = securityUtils.getCurrentUser();
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You can only update your own reviews");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review = reviewRepository.save(review);
        mapper.updateProductRating(review.getProduct());

        return mapper.toReviewDto(review);
    }

    @Transactional
    public void deleteReview(Long id) {
        User user = securityUtils.getCurrentUser();
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getUser().getId().equals(user.getId()) && user.getRole() != com.smartcart.entity.Role.ADMIN) {
            throw new BadRequestException("You can only delete your own reviews");
        }

        Product product = review.getProduct();
        reviewRepository.delete(review);
        mapper.updateProductRating(product);
    }
}
