# Restaurant Ordering Platform

A full-stack restaurant ordering system with role-based access for customers, restaurant staff, and administrators. Built with React on the frontend and Node.js/Express on the backend, exposing REST APIs for authentication, menu management, orders, and payments.

---

## Overview

The platform supports three distinct user roles, each with its own permissions and views, all backed by a shared REST API.

- **Customers** browse menus, manage a cart, place orders, pay, and track order status in real time.
- **Restaurant staff** manage menu items and process incoming orders through their lifecycle.
- **Administrators** manage users, restaurants, and system-wide data.

---

## Features

### Customer
- Browse restaurant menus with item details, descriptions, and pricing
- Add items to cart, adjust quantities, remove items
- Place orders and complete payment
- Track order status from placement through preparation to delivery
- View past order history

### Restaurant Staff
- Add, edit, and remove menu items
- Mark items as available or out of stock
- View incoming orders in a dashboard
- Update order status (received, preparing, ready, out for delivery, completed)

### Administrator
- Create, edit, and remove restaurant listings
- Manage user accounts across all roles (customers, staff, admins)
- View and manage system-wide data, including all orders and restaurant records
- Monitor platform activity across restaurants

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | Node.js, Express |
| API | REST |
| Database | *(add yours, e.g. MongoDB, PostgreSQL, MySQL)* |
| Authentication | Role-based access control (JWT or session-based) |

---

## Architecture

```
Client (React)
      │
      ▼
REST API (Express)
      │
      ▼
Database
```

Customers, staff, and admins all authenticate against the same backend but reach different route groups based on role. Middleware checks the user's role on each request and blocks access to routes outside their permissions.

---

## Data Model (high level)

- **User** — id, name, email, password hash, role (customer, staff, admin)
- **Restaurant** — id, name, address, owner/staff references, status
- **MenuItem** — id, restaurant id, name, description, price, availability
- **Cart** — user id, list of menu item ids with quantities
- **Order** — id, user id, restaurant id, items, total, status, timestamps
- **Payment** — id, order id, amount, method, status

---

## API Structure (example)

```
/api/auth
  POST   /register
  POST   /login

/api/menu
  GET    /:restaurantId          → list menu items
  POST   /:restaurantId          → add item (staff)
  PUT    /:restaurantId/:itemId  → edit item (staff)
  DELETE /:restaurantId/:itemId
