package com.smartcart.repository;

import com.smartcart.entity.ProductView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductViewRepository extends JpaRepository<ProductView, Long> {

    @Query("SELECT pv FROM ProductView pv WHERE pv.user.id = :userId ORDER BY pv.viewedAt DESC")
    List<ProductView> findRecentByUserId(@Param("userId") Long userId);

    @Query("SELECT pv.product.id, COUNT(pv) FROM ProductView pv " +
            "WHERE pv.viewedAt >= :since GROUP BY pv.product.id ORDER BY COUNT(pv) DESC")
    List<Object[]> findTrendingProductIds(@Param("since") java.time.LocalDateTime since);
}
