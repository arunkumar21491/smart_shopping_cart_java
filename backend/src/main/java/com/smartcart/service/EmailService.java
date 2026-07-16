package com.smartcart.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public void sendPasswordResetEmail(String toEmail, String token) {
        try {
            String resetLink = frontendUrl + "/reset-password?token=" + token;
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Smart Shopping Cart - Password Reset");
            message.setText("You requested a password reset. Click the link below to reset your password:\n\n"
                    + resetLink + "\n\nThis link expires in 1 hour.\n\nIf you did not request this, please ignore this email.");
            mailSender.send(message);
            log.info("Password reset email sent to {}", toEmail);
        } catch (Exception e) {
            log.warn("Failed to send email to {}: {}. Reset link: {}/reset-password?token={}",
                    toEmail, e.getMessage(), frontendUrl, token);
        }
    }

    public void sendOrderConfirmationEmail(String toEmail, String orderNumber, String totalAmount) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Smart Shopping Cart - Order Confirmation #" + orderNumber);
            message.setText("Thank you for your order!\n\nOrder Number: " + orderNumber
                    + "\nTotal Amount: ₹" + totalAmount
                    + "\n\nYou can track your order at: " + frontendUrl + "/orders");
            mailSender.send(message);
            log.info("Order confirmation email sent to {}", toEmail);
        } catch (Exception e) {
            log.warn("Failed to send order confirmation to {}: {}", toEmail, e.getMessage());
        }
    }
}
