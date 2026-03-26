# Food Delivery App

A full-stack food delivery web application built with React, Express, and MongoDB.

**Live Demo:** https://delivery-app-0ho6.onrender.com

## Accomplished Task Levels

- **Base Level** - Shops page, Shopping Cart page, form validation, orders saved to database
- **Middle Level** - Responsive design, product filtering by category, product sorting, shop filtering by rating
- **Advanced Level** - Pagination for products, order history with search, reorder functionality, coupons page with copy-to-clipboard

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB + Mongoose

## Setup

### Prerequisites

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

### Installation

```bash
npm run install:all
```

### Configuration

Create `server/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/delivery-app
PORT=5000
```

### Seed Database

```bash
npm run seed
```

### Development

```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 3000) concurrently.

### Production Build

```bash
npm run build
npm start
```

## Pages

- **Shop** (`/`) — Browse shops, filter by rating, view products with category filtering, sorting, and pagination
- **Shopping Cart** (`/cart`) — Manage cart items, apply coupons, fill delivery details, place orders
- **Order History** (`/history`) — Search orders by email, phone, or order ID; reorder previous orders
- **Coupons** (`/coupons`) — View available discount coupons and copy codes to clipboard