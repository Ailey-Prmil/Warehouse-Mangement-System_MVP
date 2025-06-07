# 📦 Smart Warehouse Management System (MVP)

This project intends to build a modular, scalable Warehouse Management System designed to streamline inbound logistics, inventory control, and outbound operations. Built for educational and real-world warehouse scenarios, OptiWare enables efficient stock handling, order fulfillment, and real-time inventory tracking.
---

### 📚 Table of Contents

* [🔧 Features](#-features)
* [📐 System Architecture](#-system-architecture)
* [🧩 Technologies Used](#-technologies-used)
* [📥 Installation](#-installation)
* [🚀 Usage Guide](#-usage-guide)
* [📊 Modules Overview](#-modules-overview)
* [🗂️ Folder Structure](#️-folder-structure)
* [🛠️ Future Improvements](#️-future-improvements)


---

### 🔧 Features

* ✅ Inbound receiving and quality checks
* ✅ Inventory tracking with real-time stock status
---

### 📐 System Architecture

```
Frontend, Backend (React/Next.js)
        ↓
Database Layer (MySQL)
        ↓
Dockerized Microservices (Optional for scaling)
```

---

### 🧩 Technologies Used

| Layer               | Tech Stack                       |
| --------------------| -------------------------------- |
| Frontend, Backend   | React.js / Next.js, Tailwind CSS |
| ORM                 | Prisma                           |
| Database            | MySQL                            |
| Auth & RBAC         | JWT, bcrypt                      |
| Deployment          | Docker, Docker Compose           |
| Versioning          | Git, GitHub                      |

---

### 📥 Installation
1. Clone the repository
``` bash
git clone https://github.com/Ailey-Prmil/Warehouse-Mangement-System_MVP.git
cd Warehouse-Mangement-System_MVP
```

3. Set up environment variables
`cp .env.example .env`
Edit .env with your DB credentials

4. Start services via Docker
`docker-compose -f docker/docker-compose.yaml up --build`
5. Start the server
Run `npm run dev`
> [!NOTE]
> If one want to remove all the data in the date base, run `docker-compose -f docker/docker-compose.yaml down -v`
> If one want to keep the data, remove the tag `-v`

> This command will remove the volume of db_data for consistent data.
> The database only run the init.sql file only when the volume/image first created.

---

### 🚀 Usage Guide
* Sign up new account via terminal:
`npx tsx src\auth\scripts\generate-account.ts <username> <password>`
* Access UI via `http://localhost:3000`
* Login with your own username and password
* Explore dashboards, add products, create orders, manage inventory.

---

### 📊 Modules Overview

#### 🔹 Inbound Logistics

* Supplier receiving
* Item inspection and quality control
* Putaway logic

#### 🔹 Inventory Management

* SKU creation and editing
* Stock in/out transactions
* Reorder level alerts

#### 🔹 Outbound Logistics

* Order creation
* Pick list generation
* Shipment tracking

#### 🔹 Admin Panel

* Role-based access
* KPI dashboards
* Activity logs

---

### 🛠️ Future Improvements

* Barcode scanning integration
* Real-time socket updates for order processing
* Mobile app for warehouse staff
* AI-based demand forecasting
* API integration with ERP systems

---
