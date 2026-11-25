# StayEase – Smart Hotel Room Reservation System

> **College Software Design Mini-Project** | **Domain:** Tourism and Hospitality  
> A commercial-grade, modern, full-stack luxury hotel reservation platform inspired by Booking.com, Airbnb, and MakeMyTrip.

---

## 🌟 Executive Summary

**StayEase** is an end-to-end hotel room reservation platform developed to exhibit modern software design principles, concurrency control, and luxury UI/UX aesthetics. Built for the Tourism and Hospitality sector, the platform delivers real-time room availability, strict double-booking prevention, customizable in-room service requests, simulated safe payment gateways, and an executive administration analytics suite.

---

## 🏗️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts |
| **Backend** | Node.js, Express.js (REST API Architecture, Controller-Route pattern) |
| **Database & ORM** | SQLite, Prisma ORM (relational data models with cascading relations) |
| **Security & Auth** | JSON Web Tokens (JWT), Bcrypt Password Hashing, Protected Routes, Role-Based Access (RBAC) |
| **Data Fetching** | Axios with request/response authorization interceptors |
| **Styling Theme** | Luxury champagne gold accents (`#C5A059`), deep midnight navy (`#0B132B`), warm beige (`#FAF7F2`) |

---

## 🔑 Key Features & Architecture

### 1. Customer Discovery & Search Engine
- Search by destination city (Bengaluru, Goa, Mumbai, Jaipur, Udaipur, Delhi, Chennai, Kochi, Agra).
- Date range picker for check-in and check-out with automatic night calculation.
- Guest and room counter dropdown.
- Advanced filtering: Price range slider, Star rating (3★, 4★, 5★), and Amenities (Infinity Pool, Beachfront, Spa, Fine Dining, etc.).
- Multi-criteria sorting (Price: Low to High, Price: High to Low, Highest Guest Rating, Most Reviewed).
- Interactive Wishlist bookmarking with instant feedback.

### 2. Room Reservation & Concurrency Engine (Zero Double-Booking)
- **Double Booking Prevention**: Before confirming any reservation, StayEase performs atomic date-overlap validation against existing bookings:
  $$\text{Overlap} \iff (\text{ExistingCheckIn} < \text{ReqCheckOut}) \land (\text{ExistingCheckOut} > \text{ReqCheckIn}) \land (\text{Status} \neq \text{CANCELLED})$$
- Only if the count of available rooms exceeds the requested room count does the server atomically commit the reservation and assign dedicated physical room numbers.
- **Server-Side Financials**: Calculates nightly room subtotal, GST hospitality taxes (12% / 18%), extra tailored experiences, and promotional coupon discounts.

### 3. Simulated Safe Payment Gateway
- Supports simulated **UPI (QR & VPA)**, **Credit Card**, **Debit Card**, and **Pay at Hotel**.
- Purely simulated educational processing (no actual card numbers stored; complies with privacy requirements).
- Generates official booking reference codes (`SE-2025-XXXXXX`) and transaction references (`TXN-STAY-XXXXXXXXX`).
- Immediate printable/downloadable digital guest pass and itemized invoice.

### 4. In-Room Concierge & Service Requests
- Guests can dispatch service requests for their active reservations:
  - 🧹 Daily Room Cleaning & Housekeeping
  - 🍽️ Food & Beverage In-Room Dining
  - 🛁 Extra Towels & Aromatherapy Toiletries
  - 👔 Express Laundry & Dry Cleaning
  - 🔧 Room Maintenance / Climate Control
  - 🚗 Airport Chauffeur Transfer
- Real-time status tracking: `PENDING` $\to$ `ACCEPTED` $\to$ `IN_PROGRESS` $\to$ `COMPLETED`.

### 5. Executive Administration Suite
- **Analytics & KPIs**: Total Customers, Total Hotels, Total Rooms, Available vs. Occupied Inventory, Gross Revenue.
- **Interactive Recharts**:
  - Monthly Revenue Area Chart
  - Monthly Booking Volume Bar Chart
  - Hotel Occupancy Rates Horizontal Bar Chart
  - Reservation Status Distribution Pie Chart
- **Full CRUD Management**:
  - Add, edit, and delete hotel properties with photo galleries and amenities.
  - Add, edit, and delete room categories, pricing, and physical room quotas.
  - Manage all customer bookings (update status to `CONFIRMED`, `CHECKED_IN`, `CHECKED_OUT`, `CANCELLED`).
  - Moderate customer reviews and oversee service requests.

---

## 👥 Demo Login Credentials

Pre-seeded accounts are ready for testing:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Executive Administrator** | `admin@stayease.com` | `admin123` | Full access to Admin Dashboard, Hotel/Room CRUD, Analytics, Booking management |
| **Customer / Guest** | `customer@stayease.com` | `customer123` | Room booking, wishlist, reviews, service requests, profile management |

*(New user registration is also fully functional with instant JWT issuance).*

---

## 🎟️ Active Promotional Coupons

Test these during checkout for verified discounts:

- **`WELCOME10`**: 10% discount on initial booking (max ₹1,500).
- **`STAYEASE20`**: 20% discount on bookings over ₹6,000 (max ₹3,500).
- **`LUXURY5000`**: Flat ₹5,000 savings on royal suites and luxury stays over ₹22,000.
- **`FESTIVE15`**: 15% discount for reservations over ₹8,000.

---

## 📂 Project Directory Structure

```
software design proj/
├── client/                      # React 18 + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── api/                 # Axios HTTP client with JWT interceptor
│   │   ├── components/
│   │   │   ├── admin/           # Admin Sidebar, Header, KPI StatCards, Modals
│   │   │   ├── booking/         # Stepper, GuestForm, PriceSummary, PaymentModal
│   │   │   ├── common/          # Navbar, Footer, Modal, StarRating, Skeletons
│   │   │   ├── home/            # Hero, SearchBar, Destinations, Featured, Offers, WhyUs, Testimonials, Newsletter
│   │   │   └── hotel/           # HotelCard, HotelFilters, HotelGallery, RoomCard, ReviewSection
│   │   ├── context/             # AuthContext (JWT session), ToastContext
│   │   ├── pages/               # Home, Hotels, Details, Booking, Confirmation, Dashboards, Auth
│   │   ├── types/               # TypeScript interfaces & domain entities
│   │   ├── utils/               # Currency, date, and night formatters
│   │   ├── App.tsx              # React Router structure
│   │   ├── index.css            # Tailwind directives & luxury styling
│   │   └── main.tsx             # React entry point
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
├── server/                      # Node.js + Express + Prisma REST API
│   ├── prisma/
│   │   ├── schema.prisma        # Relational SQLite database schema
│   │   └── seed.ts              # Comprehensive demo dataset (10 luxury hotels across India)
│   ├── src/
│   │   ├── controllers/         # Auth, Hotel, Booking, Service, Admin, Review, Coupon controllers
│   │   ├── middleware/          # JWT auth verification, Admin RBAC, Error handler
│   │   ├── routes/              # Modular Express routing
│   │   ├── utils/               # Prisma singleton instance, JWT generator
│   │   └── index.ts             # Express server entry point
│   ├── .env                     # Port and database configuration
│   ├── tsconfig.json
│   └── package.json
├── package.json                 # Monorepo root with concurrent run scripts
├── start-stayease.bat           # 1-Click Windows execution script
├── setup-db.bat                 # 1-Click Database push and seeding script
└── README.md
```

---

## 🚀 Quick Start Guide (Windows)

### Prerequisites
- **Node.js** (v18 or higher recommended; verified on Node v24)
- **npm** (v9 or higher)

### Option A: One-Click Launch (Windows)
1. Double-click `start-stayease.bat`.
2. This runs both the Backend (`http://localhost:5000`) and the Frontend (`http://localhost:3000`) concurrently.
3. Open your browser and navigate to: **[http://localhost:3000](http://localhost:3000)**

---

### Option B: Command Line (Step-by-Step)

#### 1. Install Dependencies
In the root directory, execute:
```bash
npm install
npm --prefix server install
npm --prefix client install
```

#### 2. Initialize Database & Seed Demo Data
To create the SQLite database and seed all 10 hotels, rooms, coupons, reviews, and test users:
```bash
npm run setup
```

#### 3. Run the Full Application
```bash
npm run dev
```

The application will be live at:
- **Client (Frontend)**: [http://localhost:3000](http://localhost:3000)
- **Server (REST API)**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧪 Verified User Workflows

1. **Hotel Search & Exploration**:
   - Navigate to `/hotels` or use the homepage hero search.
   - Filter by Goa, Jaipur, Bengaluru, Mumbai, Udaipur, etc.
   - Adjust price range and facilities.
2. **Hotel Details & Room Selection**:
   - Open any property (e.g., *The Grand Palace Resort & Spa*).
   - Inspect high-resolution photo gallery, amenities, and guest reviews.
   - Select room category (e.g. *Deluxe Sea View Suite* or *Royal Presidential Villa*).
3. **Reservation & Safe Checkout**:
   - Step 1: Select stay dates and room quantity.
   - Step 2: Enter guest details.
   - Step 3: Add extra services (e.g. *Chauffeur Airport Transfer*) and apply promo voucher `WELCOME10` or `STAYEASE20`.
   - Step 4: Choose simulated payment (UPI, Credit Card, or Pay at Hotel) and confirm.
   - Generate official printable invoice & guest pass.
4. **Customer Dashboard**:
   - Review upcoming reservations, previous stays, payment transactions, and wishlist.
   - Dispatch an in-room service request (e.g., *Room Cleaning* or *Food & Beverage*).
5. **Admin Operations**:
   - Sign in as `admin@stayease.com` / `admin123`.
   - Open `/admin` to review Recharts analytics, manage hotel properties, edit room categories, update reservation statuses, and review transactions.

---

## 📜 Academic Declaration
This project is developed as a mini-project for **Software Design & Architecture** in the **Tourism and Hospitality** domain. It demonstrates proper MVC/REST design, database normalization, relational integrity, server-side validation, concurrent booking isolation, and modern frontend design.
