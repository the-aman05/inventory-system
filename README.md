# Inventory & Data Management System

RESTful backend built with **Node.js, Express.js, MongoDB (Mongoose) and dotenv**.

## Features
- Mongoose schema with field-level validation (unique SKU, min/max, regex, integer quantity)
- Full CRUD for products
- Filtering, sorting and pagination via query string
- Atomic stock adjustment (restock / sale) – stock never goes negative
- Aggregation: low-stock report and category-wise summary
- Centralized error handling, ObjectId validation middleware

## Setup
```bash
npm install
cp .env.example .env     # then set MONGO_URI
npm run seed             # optional: 12 sample products
npm start
```

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/products` | Create product |
| GET | `/api/products` | List (filter / sort / paginate) |
| GET | `/api/products/:id` | Single product |
| PUT | `/api/products/:id` | Update product details |
| PATCH | `/api/products/:id/stock` | Body `{ "change": 10 }` (+ restock, - sale) |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/products/low-stock` | Items where quantity <= reorderLevel |
| GET | `/api/products/summary` | Category-wise aggregation |

**Query params for GET /api/products:** `category`, `supplier`, `search`, `minPrice`, `maxPrice`, `sort` (e.g. `-price,name`), `page`, `limit`.

## Postman Screenshots

> Replace each placeholder below with your own screenshot (put images in a `screenshots/` folder).

### 1. Create Product (POST)
![Create](screenshots/01-create.png)

### 2. Get All Products (GET)
![Get All](screenshots/02-get-all.png)

### 3. Filter / Sort / Pagination (GET)
![Filter](screenshots/03-filter-sort-page.png)

### 4. Get Product by ID (GET)
![Get One](screenshots/04-get-one.png)

### 5. Update Product (PUT)
![Update](screenshots/05-update.png)

### 6. Stock Adjustment – Restock & Sale (PATCH)
![Stock](screenshots/06-stock.png)

### 7. Delete Product (DELETE)
![Delete](screenshots/07-delete.png)

### 8. Low-Stock Report (GET)
![Low Stock](screenshots/08-low-stock.png)

### 9. Category Summary (GET)
![Summary](screenshots/09-summary.png)

### 10. Validation / Error Cases (duplicate SKU, negative price, invalid ID)
![Errors](screenshots/10-errors.png)
