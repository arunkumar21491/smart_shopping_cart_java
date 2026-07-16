# Smart Shopping Cart

Enterprise full-stack e-commerce system built with **Java 21 + Spring Boot 3** and **React 18 + Vite**.

## Features

- JWT authentication with role-based access (ADMIN / CUSTOMER)
- Product catalog with search, filter, sort, and pagination
- Shopping cart, wishlist, and checkout
- Order management with PDF invoice generation
- Payment simulation (COD, UPI, Card)
- Product reviews and ratings
- Recommendation engine (trending, similar, recently viewed)
- Admin dashboard with analytics charts
- Email notifications (password reset, order confirmation)
- Dark/light mode, glassmorphism UI, Framer Motion animations
- Swagger API documentation

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Backend | Java 21, Spring Boot 3, Spring Security, JWT, JPA, MySQL, iText PDF, JavaMail |
| Frontend | React 18, Vite, Tailwind CSS, Material UI, Framer Motion, Chart.js, Axios |
| Database | MySQL (`ecommerce_db`) |

## Project Structure

```
smart-shopping-cart/
├── backend/          # Spring Boot REST API
├── frontend/         # React Vite SPA
└── database/         # SQL schema and seed data
```

## Prerequisites

- Java 21 JDK
- Maven 3.8+
- Node.js 18+
- MySQL 8.0+

## Database Setup

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/data.sql
mysql -u root -p < database/sample_data.sql
```

Or let Spring Boot auto-create tables (`ddl-auto: update`) and use the built-in `DataInitializer` for seed data.

## Backend Setup

1. Update `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/ecommerce_db
    username: root
    password: YOUR_PASSWORD
```

2. Run the backend:

```bash
cd backend
mvn spring-boot:run
```

- API: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/api/swagger-ui.html`

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

- App: `http://localhost:5173`

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@smartcart.com | Admin@123 |

Register a new customer account at `/register`.

## API Endpoints

| Module | Base Path |
|--------|-----------|
| Auth | `/api/auth` |
| Products | `/api/products` |
| Categories | `/api/categories` |
| Cart | `/api/cart` |
| Orders | `/api/orders` |
| Wishlist | `/api/wishlist` |
| Reviews | `/api/reviews` |
| Users | `/api/users` |
| Dashboard | `/api/admin/dashboard` |
| Recommendations | `/api/recommendations` |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET` | JWT signing key | (see application.yml) |
| `MAIL_USERNAME` | SMTP email | your-email@gmail.com |
| `MAIL_PASSWORD` | SMTP app password | - |
| `FRONTEND_URL` | Frontend URL for emails | http://localhost:5173 |
| `VITE_API_URL` | API base URL for frontend | /api |

## License

MIT
