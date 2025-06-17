# 📦 Smart Warehouse Management System (MVP)

This project intends to build a modular, scalable Warehouse Management System designed to streamline inbound logistics, inventory control, and outbound operations. Built for educational and real-world warehouse scenarios, this WMS enables efficient stock handling, order fulfillment, and real-time inventory tracking with modern web technologies.

---

## 🎥 Demo Video

Watch our comprehensive demo showcasing the system's key features and functionality:

[![WMS Demo Video](https://img.youtube.com/vi/rnkpZMdt3xg/0.jpg)](https://www.youtube.com/watch?v=rnkpZMdt3xg)

**[▶️ View Full Demo](https://www.youtube.com/watch?v=rnkpZMdt3xg)**

---

## 📸 Screenshots

![image](https://github.com/user-attachments/assets/20f99773-e5a3-4c35-8972-24b2f40ed69c)
![image](https://github.com/user-attachments/assets/93dd36c7-7578-4d48-8bdb-5052354f684f)
![image](https://github.com/user-attachments/assets/33ed8eaf-8f1e-4809-a609-858cd1fa5e3d)
![image](https://github.com/user-attachments/assets/2efa0698-9d25-4c57-b6ab-2e8c16ef2310)
![image](https://github.com/user-attachments/assets/6f054a53-3306-4c9a-971e-10c6372043e3)


---

### 📚 Table of Contents

* [🔧 Features](#-features)
* [📐 System Architecture](#-system-architecture)
* [🧩 Technologies Used](#-technologies-used)
* [🤖 AI Integration](#-ai-integration)
* [📥 Installation](#-installation)
* [🚀 Usage Guide](#-usage-guide)
* [📊 Modules Overview](#-modules-overview)
* [🗂️ Folder Structure](#️-folder-structure)
* [🛠️ Future Improvements](#️-future-improvements)


---

### 🔧 Features

* ✅ **Inbound Logistics**: Comprehensive receiving workflow with quality checks
* ✅ **Real-time Inventory Tracking**: Live stock status and location management
* ✅ **Order Management**: Complete customer order lifecycle from creation to fulfillment
* ✅ **Picking & Packing**: Intelligent pick list generation and shipment tracking
* ✅ **Location Management**: Multi-zone warehouse layout with bin-level tracking
* ✅ **Stock Transactions**: Detailed audit trail of all inventory movements
* ✅ **Dashboard Analytics**: KPI monitoring and operational insights
* ✅ **Role-based Access**: Secure authentication with JWT tokens
* ✅ **REST API**: Comprehensive API with Swagger documentation
* ✅ **Responsive UI**: Modern interface built with Next.js and Tailwind CSS
---

### 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js 15)                  │
│  React 19 + TypeScript + Tailwind CSS + shadcn/ui         │
└─────────────────────┬───────────────────────────────────────┘
                      │ REST API
┌─────────────────────▼───────────────────────────────────────┐
│                Backend API Routes (Next.js)                │
│     JWT Authentication + API Documentation (Swagger)       │
└─────────────────────┬───────────────────────────────────────┘
                      │ Drizzle ORM
┌─────────────────────▼───────────────────────────────────────┐
│                Database Layer (MySQL 8.0)                  │
│            Containerized with Docker Compose               │
└─────────────────────────────────────────────────────────────┘
```

**Architecture Highlights:**
- **Full-stack TypeScript**: End-to-end type safety
- **Modern React**: Latest React 19 with Server Components
- **Database-first Design**: Schema-driven development with Drizzle ORM
- **Containerization**: Docker support for consistent deployment
- **API-first Approach**: RESTful APIs with comprehensive documentation

---

### 🧩 Technologies Used

| **Category** | **Technology** | **Purpose** |
|--------------|----------------|-------------|
| **Frontend Framework** | Next.js 15 | Full-stack React framework with App Router |
| **UI Library** | React 19 | Modern React with Server Components |
| **Language** | TypeScript | Type-safe development |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **UI Components** | shadcn/ui | High-quality component library |
| **Icons** | Lucide React | Consistent icon system |
| **Database** | MySQL 8.0 | Relational database management |
| **ORM** | Drizzle ORM | Type-safe database toolkit |
| **Authentication** | JWT + bcrypt | Secure token-based auth |
| **API Documentation** | Swagger UI | Interactive API documentation |
| **Containerization** | Docker + Compose | Development environment |
| **Charts & Analytics** | Recharts | Data visualization |
| **Form Handling** | React Hook Form | Efficient form management |
| **State Management** | React Context | Authentication state |
| **Testing** | Jest + Supertest | Unit and integration testing |
| **Code Quality** | ESLint + TypeScript | Code linting and type checking |
| **Package Manager** | npm | Dependency management |

**Key Libraries & Tools:**
- **UI Primitives**: Radix UI for accessible components
- **Styling**: class-variance-authority for component variants
- **Date Handling**: date-fns for date manipulation
- **HTTP Client**: Native fetch API
- **Development**: Hot reload with Turbopack

---

## 🤖 AI Integration

This project integrates with AI-powered pallet detection capabilities for enhanced warehouse automation:

### **🔗 [WMS Pallet Detection System](https://github.com/Trong-Tra/WMS_Pallet_Detection)**

**Key AI Features:**
- **Computer Vision**: Automated pallet detection and tracking
- **Object Recognition**: Real-time identification of warehouse objects
- **Smart Analytics**: AI-driven insights for warehouse optimization
- **Integration Ready**: Designed to work seamlessly with this WMS

**Technologies:**
- Machine Learning models for object detection
- Computer vision algorithms
- Real-time image processing
- API integration for WMS connectivity

This AI integration enhances the traditional WMS by adding intelligent automation capabilities, reducing manual processes and improving accuracy in warehouse operations.

---

### 📥 Installation

#### Prerequisites
- **Node.js** 18.0 or higher
- **Docker** and **Docker Compose**
- **Git** for version control

#### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ailey-Prmil/Warehouse-Mangement-System_MVP.git
   cd Warehouse-Mangement-System_MVP
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Database Setup**
   ```bash
   # Start MySQL database with Docker
   docker-compose -f docker/docker-compose.yaml up --build -d
   ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

#### Database Management
- **Reset Database**: `docker-compose -f docker/docker-compose.yaml down -v`
- **Keep Data**: `docker-compose -f docker/docker-compose.yaml down` (remove `-v` flag)
- **Database Port**: MySQL runs on `localhost:3307`

> [!NOTE]
> The database initialization scripts only run when the Docker volume is first created. Use `-v` flag to reset completely.

---

### 🚀 Usage Guide

#### Getting Started

1. **Create User Account**
   ```bash
   npx tsx src/auth/scripts/generate-account.ts <username> <password>
   ```

2. **Access the Application**
   - Open your browser to `http://localhost:3000`
   - Login with your created username and password

3. **Explore Features**
   - **Dashboard**: View analytics and KPIs
   - **Products**: Manage product catalog and inventory
   - **Orders**: Create and track customer orders
   - **Locations**: Manage warehouse locations and bins
   - **Transactions**: Monitor all stock movements

#### API Documentation
- **Swagger UI**: Available at `http://localhost:3000/api-doc`
- **Interactive Testing**: Test all endpoints directly in the browser
- **Schema Documentation**: Complete API reference with examples

#### Key Workflows
1. **Inbound Flow**: Receiving → Inspection → Putaway
2. **Outbound Flow**: Order Creation → Picking → Shipping  
3. **Inventory Flow**: Stock Monitoring → Transactions → Reporting

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

#### 🔮 Planned Features
* **📱 Mobile Application**: React Native app for warehouse staff
* **📊 Advanced Analytics**: Machine learning-powered demand forecasting
* **🔗 ERP Integration**: SAP, Oracle, and other enterprise system connectors
* **📡 IoT Integration**: RFID and sensor-based inventory tracking
* **🌐 Multi-warehouse**: Support for distributed warehouse networks

#### 🚀 Technical Enhancements
* **⚡ Real-time Updates**: WebSocket integration for live notifications
* **📷 Barcode Scanning**: Mobile barcode scanning capabilities
* **🤖 Process Automation**: Workflow automation and smart routing
* **📈 Predictive Analytics**: AI-driven inventory optimization
* **🔐 Advanced Security**: Enhanced RBAC and audit logging

#### 🎯 AI & Automation
* **🤖 Smart Picking**: AI-optimized pick path generation
* **🔍 Quality Control**: Computer vision for automated quality checks
* **📋 Intelligent Forecasting**: ML-based demand prediction
* **🏭 Warehouse Optimization**: AI-driven layout and process optimization

