package com.smartcart.repository;

import com.smartcart.entity.Order;
import com.smartcart.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);
    long countByStatus(OrderStatus status);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status NOT IN ('CANCELLED')")
    BigDecimal getTotalSales();

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status NOT IN ('CANCELLED') AND o.createdAt >= :startDate")
    BigDecimal getSalesSince(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT MONTH(o.createdAt) as month, SUM(o.totalAmount) as total FROM Order o " +
            "WHERE o.status NOT IN ('CANCELLED') AND YEAR(o.createdAt) = :year GROUP BY MONTH(o.createdAt)")
    List<Object[]> getMonthlySales(@Param("year") int year);

    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> countByStatusGrouped();
}
