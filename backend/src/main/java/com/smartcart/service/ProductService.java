package com.smartcart.service;

import com.smartcart.dto.PageResponse;
import com.smartcart.dto.ProductDto;
import com.smartcart.dto.ProductRequest;
import com.smartcart.entity.Category;
import com.smartcart.entity.Product;
import com.smartcart.exception.ResourceNotFoundException;
import com.smartcart.mapper.EntityMapper;
import com.smartcart.repository.CategoryRepository;
import com.smartcart.repository.ProductRepository;
import com.smartcart.util.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final EntityMapper mapper;

    public PageResponse<ProductDto> getAllProducts(int page, int size, String sortBy, String sortDir) {
        Pageable pageable = PageUtils.createPageable(page, size, sortBy, sortDir);
        Page<ProductDto> products = productRepository.findAll(pageable)
                .map(mapper::toProductDto);
        return mapper.toPageResponse(products);
    }

    public ProductDto getProductById(Long id) {
        Product product = findProductById(id);
        return mapper.toProductDto(product);
    }

    public PageResponse<ProductDto> searchProducts(String keyword, int page, int size) {
        Pageable pageable = PageUtils.createPageable(page, size, "createdAt", "desc");
        Page<ProductDto> products = productRepository.searchByKeyword(keyword, pageable)
                .map(mapper::toProductDto);
        return mapper.toPageResponse(products);
    }

    public PageResponse<ProductDto> filterProducts(Long categoryId, BigDecimal minPrice, BigDecimal maxPrice,
                                                    String keyword, int page, int size, String sortBy, String sortDir) {
        Pageable pageable = PageUtils.createPageable(page, size, sortBy, sortDir);
        Page<ProductDto> products = productRepository.filterProducts(categoryId, minPrice, maxPrice, keyword, pageable)
                .map(mapper::toProductDto);
        return mapper.toPageResponse(products);
    }

    @Transactional
    public ProductDto createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .discount(request.getDiscount() != null ? request.getDiscount() : BigDecimal.ZERO)
                .stock(request.getStock())
                .category(category)
                .imageUrl(request.getImageUrl())
                .build();

        return mapper.toProductDto(productRepository.save(product));
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductRequest request) {
        Product product = findProductById(id);
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setDiscount(request.getDiscount() != null ? request.getDiscount() : BigDecimal.ZERO);
        product.setStock(request.getStock());
        product.setCategory(category);
        product.setImageUrl(request.getImageUrl());

        return mapper.toProductDto(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = findProductById(id);
        productRepository.delete(product);
    }

    public Product findProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }
}
