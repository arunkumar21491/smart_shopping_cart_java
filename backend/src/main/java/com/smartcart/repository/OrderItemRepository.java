package com.smartcart.repository;

import com.smartcart.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("SELECT oi.product.id, SUM(oi.quantity) as totalQty FROM OrderItem oi " +
            "JOIN oi.order o WHERE o.status NOT IN ('CANCELLED') " +
            "GROUP BY oi.product.id ORDER BY totalQty DESC")
    List<Object[]> findMostPurchasedProductIds(@Param("limit") int limit);

    @Query(value = "SELECT oi.product_id, SUM(oi.quantity) as total_qty FROM order_items oi " +
            "JOIN orders o ON oi.order_id = o.id WHERE o.status != 'CANCELLED' " +
            "GROUP BY oi.product_id ORDER BY total_qty DESC LIMIT :limit", nativeQuery = true)
    List<Object[]> findMostPurchasedProductIdsNative(@Param("limit") int limit);

    @Query("SELECT oi.product.id, SUM(oi.quantity) FROM OrderItem oi " +
            "JOIN oi.order o WHERE o.status NOT IN ('CANCELLED') " +
            "GROUP BY oi.product.id ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> findTopSellingProducts();
}
