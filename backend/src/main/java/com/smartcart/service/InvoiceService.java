package com.smartcart.service;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.smartcart.entity.Order;
import com.smartcart.entity.OrderItem;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
@Slf4j
public class InvoiceService {

    public byte[] generateInvoice(Order order) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.add(new Paragraph("SMART SHOPPING CART")
                    .setFontSize(24)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER));
            document.add(new Paragraph("INVOICE")
                    .setFontSize(16)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20));

            document.add(new Paragraph("Order Number: " + order.getOrderNumber()));
            document.add(new Paragraph("Date: " + order.getCreatedAt()
                    .format(DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm"))));
            document.add(new Paragraph("Customer: " + order.getUser().getFirstName() + " " + order.getUser().getLastName()));
            document.add(new Paragraph("Email: " + order.getUser().getEmail()));
            document.add(new Paragraph("Status: " + order.getStatus()).setMarginBottom(10));

            document.add(new Paragraph("Shipping Address:").setBold());
            document.add(new Paragraph(order.getShippingAddress()));
            if (order.getShippingCity() != null) {
                document.add(new Paragraph(order.getShippingCity() + ", " + order.getShippingState() + " " + order.getShippingZip()));
            }
            document.add(new Paragraph("Phone: " + order.getShippingPhone()).setMarginBottom(15));

            Table table = new Table(UnitValue.createPercentArray(new float[]{3, 1, 1, 1, 1}))
                    .useAllAvailableWidth();
            table.addHeaderCell(new Cell().add(new Paragraph("Product").setBold()).setBackgroundColor(ColorConstants.LIGHT_GRAY));
            table.addHeaderCell(new Cell().add(new Paragraph("Price").setBold()).setBackgroundColor(ColorConstants.LIGHT_GRAY));
            table.addHeaderCell(new Cell().add(new Paragraph("Qty").setBold()).setBackgroundColor(ColorConstants.LIGHT_GRAY));
            table.addHeaderCell(new Cell().add(new Paragraph("Disc%").setBold()).setBackgroundColor(ColorConstants.LIGHT_GRAY));
            table.addHeaderCell(new Cell().add(new Paragraph("Total").setBold()).setBackgroundColor(ColorConstants.LIGHT_GRAY));

            for (OrderItem item : order.getItems()) {
                table.addCell(item.getProductName());
                table.addCell("₹" + item.getUnitPrice());
                table.addCell(String.valueOf(item.getQuantity()));
                table.addCell(item.getDiscount() + "%");
                table.addCell("₹" + item.getTotalPrice());
            }

            document.add(table);
            document.add(new Paragraph("\nSubtotal: ₹" + order.getSubtotal()).setTextAlignment(TextAlignment.RIGHT));
            document.add(new Paragraph("Discount: -₹" + order.getDiscountAmount()).setTextAlignment(TextAlignment.RIGHT));
            document.add(new Paragraph("Total: ₹" + order.getTotalAmount())
                    .setBold()
                    .setFontSize(14)
                    .setTextAlignment(TextAlignment.RIGHT));

            if (order.getPayment() != null) {
                document.add(new Paragraph("\nPayment Method: " + order.getPayment().getPaymentMethod())
                        .setMarginTop(10));
                document.add(new Paragraph("Payment Status: " + order.getPayment().getStatus()));
            }

            document.add(new Paragraph("\nThank you for shopping with Smart Shopping Cart!")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(30));

            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            log.error("Failed to generate invoice", e);
            throw new RuntimeException("Failed to generate invoice", e);
        }
    }
}
