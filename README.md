# 🛒 E-Commerce Backend API

This is the backend of a full-stack E-Commerce application built using **Node.js**, **Express**, and **MongoDB**.

## 🚀 Features

- User Authentication (Register, Login, Logout)
- Product Management (Admin + Shop)
- Cart System
- Address Management
- Order Processing with **PayPal Integration**
- Search and Reviews
- Role-Based Access Control

## 🛠️ Technologies

- Node.js
- Express.js
- MongoDB + Mongoose
- PayPal REST API
- JWT Authentication
- Cookie-Based Sessions
- CORS

## 📚 API Routes

### 🔍 Search Routes
- `GET /shop/search?q=keyword`

### 🛍️ Shop Product Routes
- `GET /shop/products`
- `GET /shop/products/:id`

### 🛒 Shop Cart Routes
- `GET /shop/cart`
- `POST /shop/cart`
- `PUT /shop/cart/:productId`
- `DELETE /shop/cart/:productId`

### 🏠 Shop Address Routes
- `GET /shop/address`
- `POST /shop/address`
- `PUT /shop/address/:id`
- `DELETE /shop/address/:id`

### 📦 Shop Order Routes
- `GET /shop/order`
- `GET /shop/order/:id`
- `POST /shop/order`

### ⭐ Shop Review Routes
- `GET /shop/review/:productId`
- `POST /shop/review`

### 🧑‍💼 Admin Product Routes
- `GET /admin/products`
- `POST /admin/products`
- `PUT /admin/products/:id`
- `DELETE /admin/products/:id`

### 📦 Admin Order Routes
- `GET /admin/orders`
- `GET /admin/orders/:id`
- `PUT /admin/orders/:id`

### 🔐 Auth Routes
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`

### 🧩 Common Feature Routes
- `GET /common/feature`
