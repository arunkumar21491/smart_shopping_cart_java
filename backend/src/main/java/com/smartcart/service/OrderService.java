package com.smartcart.service;

import com.smartcart.dto.*;
import com.smartcart.entity.*;
import com.smartcart.exception.BadRequestException;
import com.smartcart.exception.ResourceNotFoundException;
import com.smartcart.mapper.EntityMapper;
import com.smartcart.repository.CartItemRepository;
import com.smartcart.repository.OrderRepository;
import com.smartcart.security.SecurityUtils;
import com.smartcart.util.PageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final CartService cartService;
    private final ProductService productService;
    private final SecurityUtils securityUtils;
    private final EntityMapper mapper;
    private final InvoiceService invoiceService;
    private final EmailService emailService;

    @Transactional
    public OrderDto checkout(CheckoutRequest request) {
        User user = securityUtils.getCurrentUser();
        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());

        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        CartSummaryDto cart = cartService.getCartForUser(user);
        String orderNumber = generateOrderNumber();

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .user(user)
                .status(OrderStatus.PENDING)
                .subtotal(cart.getSubtotal())
                .discountAmount(cart.getDiscountAmount())
                .totalAmount(cart.getTotal())
                .shippingAddress(request.getShippingAddress())
                .shippingCity(request.getShippingCity())
                .shippingState(request.getShippingState())
                .shippingZip(request.getShippingZip())
                .shippingPhone(request.getShippingPhone())
                .notes(request.getNotes())
                .items(new ArrayList<>())
                .build();

        for (CartItem cartItem : cartItems) {
            Product product = productService.findProductById(cartItem.getProduct().getId());

            if (product.getStock() < cartItem.getQuantity()) {
                throw new BadRequestException("Insufficient stock for: " + product.getName());
            }

            product.setStock(product.getStock() - cartItem.getQuantity());

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .productName(product.getName())
                    .quantity(cartItem.getQuantity())
                    .unitPrice(product.getPrice())
                    .discount(product.getDiscount())
                    .totalPrice(product.getDiscountedPrice()
                            .multiply(java.math.BigDecimal.valueOf(cartItem.getQuantity())))
                    .build();

            order.getItems().add(orderItem);
        }

        PaymentStatus paymentStatus = processPayment(request);
        OrderStatus orderStatus = paymentStatus == PaymentStatus.SUCCESS ? OrderStatus.CONFIRMED : OrderStatus.PENDING;
        order.setStatus(orderStatus);

        Payment payment = Payment.builder()
                .order(order)
                .paymentMethod(request.getPaymentMethod())
                .status(paymentStatus)
                .amount(order.getTotalAmount())
                .transactionId(paymentStatus == PaymentStatus.SUCCESS
                        ? "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase() : null)
                .paymentDate(paymentStatus == PaymentStatus.SUCCESS ? LocalDateTime.now() : null)
                .build();

        order.setPayment(payment);
        Order savedOrder = orderRepository.save(order);

        cartService.clearCart();
        emailService.sendOrderConfirmationEmail(user.getEmail(), orderNumber, order.getTotalAmount().toString());

        return mapper.toOrderDto(savedOrder);
    }

    private PaymentStatus processPayment(CheckoutRequest request) {
        return switch (request.getPaymentMethod()) {
            case COD -> PaymentStatus.PENDING;
            case UPI -> {
                if (request.getUpiId() == null || request.getUpiId().isBlank()) {
                    throw new BadRequestException("UPI ID is required");
                }
                yield PaymentStatus.SUCCESS;
            }
            case CARD -> {
                if (request.getCardNumber() == null || request.getCardNumber().length() < 16) {
                    throw new BadRequestException("Valid card number is required");
                }
                yield PaymentStatus.SUCCESS;
            }
        };
    }

    private String generateOrderNumber() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String unique = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        return "ORD-" + date + "-" + unique;
    }

    public PageResponse<OrderDto> getMyOrders(int page, int size) {
        User user = securityUtils.getCurrentUser();
        Page<OrderDto> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId(),
                PageUtils.createPageable(page, size, "createdAt", "desc"))
                .map(mapper::toOrderDto);
        return mapper.toPageResponse(orders);
    }

    public OrderDto getOrderById(Long id) {
        Order order = findOrderById(id);
        User user = securityUtils.getCurrentUser();
        if (!order.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new BadRequestException("Access denied");
        }
        return mapper.toOrderDto(order);
    }

    public OrderDto trackOrder(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return mapper.toOrderDto(order);
    }

    @Transactional
    public OrderDto cancelOrder(Long id) {
        Order order = findOrderById(id);
        User user = securityUtils.getCurrentUser();

        if (!order.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new BadRequestException("Access denied");
        }

        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Cannot cancel order in status: " + order.getStatus());
        }

        order.setStatus(OrderStatus.CANCELLED);

        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
        }

        return mapper.toOrderDto(orderRepository.save(order));
    }

    public byte[] generateInvoice(Long id) {
        Order order = findOrderById(id);
        User user = securityUtils.getCurrentUser();
        if (!order.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new BadRequestException("Access denied");
        }
        return invoiceService.generateInvoice(order);
    }

    public PageResponse<OrderDto> getAllOrders(int page, int size) {
        Page<OrderDto> orders = orderRepository.findAllByOrderByCreatedAtDesc(
                PageUtils.createPageable(page, size, "createdAt", "desc"))
                .map(mapper::toOrderDto);
        return mapper.toPageResponse(orders);
    }

    @Transactional
    public OrderDto updateOrderStatus(Long id, OrderStatus status) {
        Order order = findOrderById(id);
        order.setStatus(status);
        return mapper.toOrderDto(orderRepository.save(order));
    }

    private Order findOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }
}
