package com.smartcart.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private BigDecimal totalSales;
    private long totalOrders;
    private long totalUsers;
    private long totalProducts;
    private long pendingOrders;
    private long deliveredOrders;
    private List<ChartDataPoint> revenueChart;
    private List<ChartDataPoint> ordersChart;
    private List<ChartDataPoint> categoryChart;
    private List<ChartDataPoint> monthlySalesChart;
    private List<ProductDto> topProducts;
    private List<OrderDto> recentOrders;
    private Map<String, Long> ordersByStatus;
}
