package com.smartcart.service;

import com.smartcart.dto.*;
import com.smartcart.entity.OrderStatus;
import com.smartcart.entity.Role;
import com.smartcart.mapper.EntityMapper;
import com.smartcart.repository.*;
import com.smartcart.util.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final OrderItemRepository orderItemRepository;
    private final EntityMapper mapper;

    public DashboardStatsDto getDashboardStats() {
        BigDecimal totalSales = orderRepository.getTotalSales();
        long totalOrders = orderRepository.count();
        long totalUsers = userRepository.countByRole(Role.CUSTOMER);
        long totalProducts = productRepository.count();
        long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING);
        long deliveredOrders = orderRepository.countByStatus(OrderStatus.DELIVERED);

        Map<String, Long> ordersByStatus = new LinkedHashMap<>();
        for (OrderStatus status : OrderStatus.values()) {
            ordersByStatus.put(status.name(), orderRepository.countByStatus(status));
        }

        return DashboardStatsDto.builder()
                .totalSales(totalSales != null ? totalSales : BigDecimal.ZERO)
                .totalOrders(totalOrders)
                .totalUsers(totalUsers)
                .totalProducts(totalProducts)
                .pendingOrders(pendingOrders)
                .deliveredOrders(deliveredOrders)
                .revenueChart(buildRevenueChart())
                .ordersChart(buildOrdersChart())
                .categoryChart(buildCategoryChart())
                .monthlySalesChart(buildMonthlySalesChart())
                .topProducts(getTopProducts())
                .recentOrders(orderRepository.findAllByOrderByCreatedAtDesc(
                        PageUtils.createPageable(0, 5, "createdAt", "desc"))
                        .map(mapper::toOrderDto).getContent())
                .ordersByStatus(ordersByStatus)
                .build();
    }

    private List<ChartDataPoint> buildMonthlySalesChart() {
        int year = LocalDateTime.now().getYear();
        List<Object[]> results = orderRepository.getMonthlySales(year);
        Map<Integer, BigDecimal> salesByMonth = new HashMap<>();
        for (Object[] row : results) {
            salesByMonth.put(((Number) row[0]).intValue(), (BigDecimal) row[1]);
        }
        List<ChartDataPoint> chart = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            chart.add(ChartDataPoint.builder()
                    .label(Month.of(m).getDisplayName(TextStyle.SHORT, Locale.ENGLISH))
                    .value(salesByMonth.getOrDefault(m, BigDecimal.ZERO))
                    .build());
        }
        return chart;
    }

    private List<ChartDataPoint> buildCategoryChart() {
        return categoryRepository.findAll().stream()
                .map(cat -> ChartDataPoint.builder()
                        .label(cat.getName())
                        .count(productRepository.countByCategoryId(cat.getId()))
                        .value(BigDecimal.valueOf(productRepository.countByCategoryId(cat.getId())))
                        .build())
                .collect(Collectors.toList());
    }

    private List<ChartDataPoint> buildOrdersChart() {
        List<ChartDataPoint> chart = new ArrayList<>();
        for (OrderStatus status : OrderStatus.values()) {
            chart.add(ChartDataPoint.builder()
                    .label(status.name())
                    .count(orderRepository.countByStatus(status))
                    .build());
        }
        return chart;
    }

    private List<ChartDataPoint> buildRevenueChart() {
        List<ChartDataPoint> chart = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        for (int i = 5; i >= 0; i--) {
            LocalDateTime start = now.minusMonths(i).withDayOfMonth(1).withHour(0).withMinute(0);
            BigDecimal sales = orderRepository.getSalesSince(start);
            chart.add(ChartDataPoint.builder()
                    .label(start.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH))
                    .value(sales != null ? sales : BigDecimal.ZERO)
                    .build());
        }
        return chart;
    }

    private List<ProductDto> getTopProducts() {
        List<ProductDto> products = new ArrayList<>();
        int count = 0;
        for (Object[] row : orderItemRepository.findTopSellingProducts()) {
            if (count >= 5) break;
            productRepository.findById(((Number) row[0]).longValue())
                    .ifPresent(p -> products.add(mapper.toProductDto(p)));
            count++;
        }
        if (products.isEmpty()) {
            return productRepository.findTopRated(PageRequest.of(0, 5)).stream()
                    .map(mapper::toProductDto).collect(Collectors.toList());
        }
        return products;
    }
}
