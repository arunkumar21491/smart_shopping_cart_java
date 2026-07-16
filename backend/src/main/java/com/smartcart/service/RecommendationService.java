package com.smartcart.service;

import com.smartcart.dto.ProductDto;
import com.smartcart.entity.Product;
import com.smartcart.entity.ProductView;
import com.smartcart.entity.User;
import com.smartcart.repository.OrderItemRepository;
import com.smartcart.repository.ProductRepository;
import com.smartcart.repository.ProductViewRepository;
import com.smartcart.security.SecurityUtils;
import com.smartcart.mapper.EntityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductViewRepository productViewRepository;
    private final ProductService productService;
    private final SecurityUtils securityUtils;
    private final EntityMapper mapper;

    public List<ProductDto> getMostPurchased() {
        List<Object[]> results = orderItemRepository.findMostPurchasedProductIdsNative(8);
        return getProductsFromIds(results);
    }

    public List<ProductDto> getTrending() {
        LocalDateTime since = LocalDateTime.now().minusDays(30);
        List<Object[]> viewResults = productViewRepository.findTrendingProductIds(since);

        if (!viewResults.isEmpty()) {
            return getProductsFromIds(viewResults);
        }

        return productRepository.findTopRated(PageRequest.of(0, 8)).stream()
                .map(mapper::toProductDto)
                .collect(Collectors.toList());
    }

    public List<ProductDto> getSimilarProducts(Long productId) {
        Product product = productService.findProductById(productId);
        return productRepository.findByCategoryIdAndIdNot(
                product.getCategory().getId(), productId, PageRequest.of(0, 8))
                .stream()
                .map(mapper::toProductDto)
                .collect(Collectors.toList());
    }

    public List<ProductDto> getRecentlyViewed() {
        try {
            User user = securityUtils.getCurrentUser();
            List<ProductView> views = productViewRepository.findRecentByUserId(user.getId());

            Set<Long> seen = new LinkedHashSet<>();
            List<ProductDto> products = new ArrayList<>();

            for (ProductView view : views) {
                if (seen.add(view.getProduct().getId()) && products.size() < 8) {
                    products.add(mapper.toProductDto(view.getProduct()));
                }
            }
            return products;
        } catch (Exception e) {
            return List.of();
        }
    }

    @Transactional
    public void recordProductView(Long productId) {
        try {
            User user = securityUtils.getCurrentUser();
            Product product = productService.findProductById(productId);

            ProductView view = ProductView.builder()
                    .user(user)
                    .product(product)
                    .build();
            productViewRepository.save(view);
        } catch (Exception e) {
            // Allow anonymous product views to be skipped
        }
    }

    private List<ProductDto> getProductsFromIds(List<Object[]> results) {
        List<ProductDto> products = new ArrayList<>();
        for (Object[] row : results) {
            Long productId = ((Number) row[0]).longValue();
            productRepository.findById(productId)
                    .ifPresent(p -> products.add(mapper.toProductDto(p)));
        }
        return products;
    }
}
