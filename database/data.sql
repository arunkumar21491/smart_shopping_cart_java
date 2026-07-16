-- SMART SHOPPING CART - Base Data
USE ecommerce_db;

-- Admin user (password: Admin@123)
INSERT INTO users (first_name, last_name, email, password, phone, role, enabled) VALUES
('System', 'Admin', 'admin@smartcart.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+911234567890', 'ADMIN', TRUE);

-- Categories
INSERT INTO categories (name, description, image_url) VALUES
('Electronics', 'Latest gadgets and electronic devices', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400'),
('Fashion', 'Trendy clothing and accessories', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400'),
('Home & Kitchen', 'Home essentials and kitchen appliances', 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400'),
('Books', 'Books for all ages and interests', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400'),
('Sports', 'Sports equipment and fitness gear', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400'),
('Beauty', 'Beauty and personal care products', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400');
