-- SMART SHOPPING CART - Sample Data for Demo
USE ecommerce_db;

-- Sample customer users (password: Customer@123)
INSERT INTO users (first_name, last_name, email, password, phone, role, enabled) VALUES
('John', 'Doe', 'john@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+919876543210', 'CUSTOMER', TRUE),
('Jane', 'Smith', 'jane@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+919876543211', 'CUSTOMER', TRUE),
('Mike', 'Johnson', 'mike@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+919876543212', 'CUSTOMER', TRUE);

-- Sample Products
INSERT INTO products (name, description, price, discount, stock, category_id, image_url, rating) VALUES
('iPhone 15 Pro', 'Latest Apple smartphone with A17 Pro chip, titanium design, and advanced camera system.', 134900.00, 5.00, 50, 1, 'https://images.unsplash.com/photo-1695048133142-ffc1d3f5d882?w=400', 4.80),
('Samsung Galaxy S24 Ultra', 'Premium Android flagship with S Pen, 200MP camera, and AI features.', 129999.00, 8.00, 45, 1, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400', 4.70),
('MacBook Pro 14"', 'Apple M3 Pro chip, Liquid Retina XDR display, up to 18 hours battery life.', 199900.00, 3.00, 30, 1, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 4.90),
('Sony WH-1000XM5', 'Industry-leading noise canceling wireless headphones with 30-hour battery.', 29990.00, 10.00, 100, 1, 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400', 4.60),
('Apple Watch Series 9', 'Advanced health features, always-on Retina display, crash detection.', 41900.00, 0.00, 75, 1, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400', 4.50),
('Men Leather Jacket', 'Premium genuine leather jacket with modern slim fit design.', 4999.00, 15.00, 60, 2, 'https://images.unsplash.com/photo-1551028711-00167b16eac5?w=400', 4.30),
('Women Summer Dress', 'Elegant floral print summer dress, breathable cotton fabric.', 2499.00, 20.00, 80, 2, 'https://images.unsplash.com/photo-1595777457583-95e059ec5812?w=400', 4.40),
('Running Sneakers', 'Lightweight running shoes with cushioned sole and breathable mesh.', 3999.00, 12.00, 120, 2, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 4.60),
('Designer Handbag', 'Luxury leather handbag with multiple compartments.', 8999.00, 10.00, 40, 2, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400', 4.50),
('Air Fryer 5L', 'Digital air fryer with 8 preset cooking modes and non-stick basket.', 5999.00, 18.00, 55, 3, 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400', 4.40),
('Coffee Maker', 'Programmable drip coffee maker with thermal carafe.', 3499.00, 8.00, 70, 3, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400', 4.20),
('Robot Vacuum', 'Smart robot vacuum with mapping and app control.', 24999.00, 15.00, 25, 3, 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400', 4.70),
('The Psychology of Money', 'Timeless lessons on wealth, greed, and happiness by Morgan Housel.', 399.00, 0.00, 200, 4, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', 4.80),
('Atomic Habits', 'An easy and proven way to build good habits by James Clear.', 499.00, 5.00, 180, 4, 'https://images.unsplash.com/photo-1589998059174-4d882f242e97?w=400', 4.90),
('Yoga Mat Premium', 'Extra thick non-slip yoga mat with carrying strap.', 1499.00, 10.00, 150, 5, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400', 4.30),
('Dumbbell Set 20kg', 'Adjustable dumbbell set for home workouts.', 4999.00, 12.00, 35, 5, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', 4.50),
('Skincare Set', 'Complete skincare routine with cleanser, toner, and moisturizer.', 2999.00, 15.00, 90, 6, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', 4.40),
('Perfume Eau de Parfum', 'Luxury fragrance with long-lasting scent.', 5999.00, 8.00, 65, 6, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', 4.60),
('Wireless Earbuds', 'True wireless earbuds with active noise cancellation.', 4999.00, 20.00, 110, 1, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', 4.50),
('Smart TV 55"', '4K Ultra HD Smart LED TV with HDR and voice control.', 45999.00, 12.00, 20, 1, 'https://images.unsplash.com/photo-1593359673509-e6ba3cbc9706?w=400', 4.70);

-- Sample Reviews
INSERT INTO reviews (user_id, product_id, rating, comment) VALUES
(2, 1, 5, 'Amazing phone! The camera quality is outstanding.'),
(3, 1, 4, 'Great device but a bit pricey.'),
(2, 3, 5, 'Best laptop I have ever used. Super fast!'),
(4, 6, 4, 'Good quality leather, fits perfectly.'),
(3, 13, 5, 'Life-changing book. Highly recommend!'),
(2, 15, 4, 'Comfortable mat, good grip.');

-- Sample Orders
INSERT INTO orders (order_number, user_id, status, subtotal, discount_amount, total_amount, shipping_address, shipping_city, shipping_state, shipping_zip, shipping_phone) VALUES
('ORD-20260101-001', 2, 'DELIVERED', 134900.00, 6745.00, 128155.00, '123 Main Street', 'Mumbai', 'Maharashtra', '400001', '+919876543210'),
('ORD-20260105-002', 3, 'SHIPPED', 29990.00, 2999.00, 26991.00, '456 Oak Avenue', 'Delhi', 'Delhi', '110001', '+919876543211'),
('ORD-20260110-003', 2, 'PROCESSING', 4999.00, 749.85, 4249.15, '123 Main Street', 'Mumbai', 'Maharashtra', '400001', '+919876543210');

INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, discount, total_price) VALUES
(1, 1, 'iPhone 15 Pro', 1, 134900.00, 5.00, 128155.00),
(2, 4, 'Sony WH-1000XM5', 1, 29990.00, 10.00, 26991.00),
(3, 6, 'Men Leather Jacket', 1, 4999.00, 15.00, 4249.15);

INSERT INTO payments (order_id, payment_method, status, transaction_id, amount, payment_date) VALUES
(1, 'CARD', 'SUCCESS', 'TXN-20260101-001', 128155.00, '2026-01-01 10:30:00'),
(2, 'UPI', 'SUCCESS', 'TXN-20260105-002', 26991.00, '2026-01-05 14:20:00'),
(3, 'COD', 'PENDING', NULL, 4249.15, NULL);
