# StayEase – Cloud Deployment Guide (Vercel & Render)

This guide walks you through deploying **StayEase** to the cloud so anyone can access your hotel reservation system via a public HTTPS URL.

---

## 🏗️ Architecture Overview

| Component | Technology | Best Free Host | Reason |
| :--- | :--- | :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, Tailwind | **Vercel** | Ultra-fast edge CDN, instant preview URLs, custom domain support. |
| **Backend & DB** | Node.js, Express, Prisma ORM, SQLite | **Render** / **Railway** | Supports persistent filesystem for SQLite, long-running WebSocket/HTTP server. |

> **Why split Frontend (Vercel) & Backend (Render)?**  
> Vercel functions are **serverless** with a read-only ephemeral disk. A local SQLite database (`dev.db`) on Vercel would lose new bookings when functions scale down. Deploying the Node.js backend on **Render.com** (or Railway/Koyeb) keeps the database running and persistent for 100% free!

---

## Step 1: Push Code to GitHub

1. Open your terminal in the project directory:
   ```bash
   git init
   git add .
   git commit -m "feat: complete StayEase full-stack reservation system"
   ```
2. Create a new repository on [GitHub](https://github.com/new) named `stayease-hotel-system`.
3. Push your repository:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/stayease-hotel-system.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 2: Deploy the Backend API (Render.com)

1. Sign up / Log in to [Render.com](https://render.com) (free).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository `stayease-hotel-system`.
4. Fill in the service configuration:
   * **Name**: `stayease-api`
   * **Region**: Choose the closest region (e.g., Singapore, Frankfurt, Oregon).
   * **Root Directory**: `server`
   * **Runtime**: `Node`
   * **Build Command**:
     ```bash
     npm install && npx prisma generate && npx prisma db push && npx tsx prisma/seed.ts && npx tsc
     ```
   * **Start Command**:
     ```bash
     npm start
     ```
   * **Instance Type**: `Free`
5. Click **Advanced** -> **Add Environment Variable**:
   * `NODE_ENV`: `production`
   * `PORT`: `5000`
   * `JWT_SECRET`: `stayease_super_secure_jwt_secret_2026`
   * `DATABASE_URL`: `file:./dev.db`
6. Click **Create Web Service**.
7. Once deployed, Render will give you a public URL, for example:  
   👉 `https://stayease-api.onrender.com`

---

## Step 3: Deploy the Frontend on Vercel

1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository `stayease-hotel-system`.
4. In the **Configure Project** screen:
   * **Project Name**: `stayease`
   * **Framework Preset**: `Vite`
   * **Root Directory**: Click *Edit* and select **`client`**.
   * **Build and Output Settings**:
     * **Build Command**: `npm run build`
     * **Output Directory**: `dist`
     * **Install Command**: `npm install`
5. Expand **Environment Variables** and add:
   * **Key**: `VITE_API_URL`
   * **Value**: `https://stayease-api.onrender.com/api`  *(Use your actual Render URL from Step 2)*
6. Click **Deploy**.

---

## Step 4: Verify Your Live Deployment

* Vercel will assign a public domain: `https://stayease.vercel.app`
* All SPA routes (`/hotels`, `/hotels/:id`, `/my-bookings`, `/admin`) work seamlessly thanks to [client/vercel.json](file:///c:/Users/MURULI%20MOHAN%20M%20A/Downloads/software%20design%20proj/client/vercel.json).
* All API requests from the frontend will route to your live backend on Render.

---

## 🔑 Default Credentials on Live Deployment
* **Admin**: `admin@stayease.com` / `admin123`
* **Customer**: `customer@stayease.com` / `customer123`
