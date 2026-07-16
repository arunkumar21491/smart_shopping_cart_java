package com.smartcart.config;

import com.smartcart.entity.*;
import com.smartcart.repository.CategoryRepository;
import com.smartcart.repository.ProductRepository;
import com.smartcart.repository.UserRepository;

import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail("admin@smartcart.com").isEmpty()) {
            User admin = User.builder()
                    .firstName("System")
                    .lastName("Admin")
                    .email("admin@smartcart.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .phone("+911234567890")
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            log.info("Default admin user created: admin@smartcart.com / Admin@123");
        }

        if (categoryRepository.count() == 0) {
            String[][] categories = {
                    {"Electronics", "Latest gadgets and electronic devices", "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400"},
                    {"Fashion", "Trendy clothing and accessories", "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400"},
                    {"Home & Kitchen", "Home essentials and kitchen appliances", "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400"},
                    {"Books", "Books for all ages and interests", "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400"},
                    {"Sports", "Sports equipment and fitness gear", "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400"},
                    {"Beauty", "Beauty and personal care products", "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400"}
            };

            for (String[] cat : categories) {
                categoryRepository.save(Category.builder()
                        .name(cat[0])
                        .description(cat[1])
                        .imageUrl(cat[2])
                        .build());
            }
            log.info("Default categories initialized");
        }

        if (productRepository.count() == 0 && categoryRepository.count() > 0) {
            seedProducts();
            log.info("Sample products initialized");
        }
    }

    private void seedProducts() {
        Object[][] products = {
                {"iPhone 15 Pro", "Latest Apple smartphone with A17 Pro chip.", 134900, 5, 50, 1L, "https://images.unsplash.com/photo-1695048133142-ffc1d3f5d882?w=400", 4.8},
                {"Samsung Galaxy S24", "Premium Android flagship with AI features.", 129999, 8, 45, 1L, "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400", 4.7},
                {"MacBook Pro 14\"", "Apple M3 Pro chip, stunning display.", 199900, 3, 30, 1L, "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400", 4.9},
                {"Sony WH-1000XM5", "Industry-leading noise canceling headphones.", 29990, 10, 100, 1L, "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400", 4.6},
                {"Men Leather Jacket", "Premium genuine leather jacket.", 4999, 15, 60, 2L, "https://images.unsplash.com/photo-1551028711-00167b16eac5?w=400", 4.3},
                {"Women Summer Dress", "Elegant floral print summer dress.", 2499, 20, 80, 2L, "https://images.unsplash.com/photo-1595777457583-95e059ec5812?w=400", 4.4},
                {"Running Sneakers", "Lightweight running shoes.", 3999, 12, 120, 2L, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", 4.6},
                {"Air Fryer 5L", "Digital air fryer with 8 preset modes.", 5999, 18, 55, 3L, "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400", 4.4},
                {"Atomic Habits", "Build good habits by James Clear.", 499, 5, 180, 4L, "https://images.unsplash.com/photo-1589998059174-4d882f242e97?w=400", 4.9},
                {"Yoga Mat Premium", "Extra thick non-slip yoga mat.", 1499, 10, 150, 5L, "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400", 4.3},
                {"Skincare Set", "Complete skincare routine set.", 2999, 15, 90, 6L, "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400", 4.4},
                {"Wireless Earbuds", "True wireless with noise cancellation.", 4999, 20, 110, 1L, "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400", 4.5}
        };

        for (Object[] p : products) {
            Category category = categoryRepository.findById((Long) p[5])
                    .orElse(categoryRepository.findAll().get(0));
            productRepository.save(Product.builder()
                    .name((String) p[0])
                    .description((String) p[1])
                    .price(BigDecimal.valueOf((Integer) p[2]))
                    .discount(BigDecimal.valueOf((Integer) p[3]))
                    .stock((Integer) p[4])
                    .category(category)
                    .imageUrl((String) p[6])
                    .rating(BigDecimal.valueOf((Double) p[7]))
                    .build());
        }
    }
}
