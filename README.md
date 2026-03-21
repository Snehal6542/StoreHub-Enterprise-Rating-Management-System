# 🏪 Enterprise Store Rating Management System

> A sophisticated, production-ready full-stack web application featuring advanced role-based access control, real-time analytics, and enterprise-grade security implementations.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18-lightgrey.svg)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3.x-blue.svg)](https://www.sqlite.org/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-orange.svg)](https://jwt.io/)
[![bcrypt](https://img.shields.io/badge/bcrypt-Encryption-red.svg)](https://www.npmjs.com/package/bcrypt)

## 🚀 Architecture Overview

This enterprise-grade application demonstrates advanced full-stack development principles with a microservices-inspired architecture, implementing industry-standard security protocols and scalable design patterns.

### 🛠️ Technology Stack

#### Backend Infrastructure
- **Runtime Environment**: Node.js 18.x with Express.js framework
- **Database Engine**: SQLite with optimized indexing strategies
- **Authentication**: JWT-based stateless authentication with bcrypt encryption
- **API Architecture**: RESTful API design with middleware-based request processing
- **Validation Layer**: Express-validator with custom validation middleware
- **Security**: CORS implementation, SQL injection prevention, input sanitization

#### Frontend Architecture
- **Framework**: React 18.x with functional components and hooks
- **State Management**: React Context API with custom hooks
- **HTTP Client**: Axios with interceptors for token management
- **UI/UX**: Responsive design with modern CSS3 and component-based architecture
- **Routing**: React Router with protected route implementations

#### Development & Deployment
- **Process Management**: Nodemon for development hot-reloading
- **Package Management**: NPM with lock files for dependency consistency
- **Environment Configuration**: dotenv for secure environment variable management
- **Database Migration**: Automated schema initialization with sample data seeding

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │────│  Express API    │────│   SQLite DB     │
│                 │    │                 │    │                 │
│ • Components    │    │ • Controllers   │    │ • Normalized    │
│ • State Mgmt    │    │ • Middleware    │    │   Schema        │
│ • HTTP Client   │    │ • Validators    │    │ • Indexes       │
│ • Routing       │    │ • Auth Layer    │    │ • Constraints   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Advanced Features

### 🔐 Multi-Tier Security Implementation
- **JWT Authentication**: Stateless token-based authentication with configurable expiration
- **Password Security**: bcrypt hashing with salt rounds for enhanced security
- **Role-Based Access Control (RBAC)**: Granular permissions with middleware enforcement
- **Input Validation**: Comprehensive server-side validation with sanitization
- **SQL Injection Prevention**: Parameterized queries and prepared statements
- **CORS Configuration**: Cross-origin resource sharing with security headers

### 📊 Real-Time Analytics Dashboard
- **Admin Analytics**: Comprehensive system metrics and user engagement statistics
- **Store Performance**: Advanced rating analytics with trend analysis
- **User Behavior Tracking**: Registration patterns and activity monitoring
- **Data Visualization**: Interactive charts and performance indicators

### 🎨 Advanced User Experience
- **Responsive Design**: Mobile-first approach with cross-device compatibility
- **Dynamic Search & Filtering**: Real-time search with multiple filter criteria
- **Sorting Capabilities**: Multi-column sorting with persistence
- **Form Validation**: Client-side and server-side validation with user feedback
- **Loading States**: Optimized user experience with loading indicators

### 🏢 Enterprise-Grade Role Management

#### System Administrator Portal
- **Comprehensive Dashboard**: Real-time system metrics and KPI monitoring
- **User Management**: Advanced user creation with role assignment
- **Store Administration**: Complete store lifecycle management
- **Analytics & Reporting**: Detailed system usage and performance reports
- **Bulk Operations**: Efficient batch processing for administrative tasks

#### Store Owner Interface
- **Performance Dashboard**: Advanced analytics with rating trends
- **Customer Insights**: Detailed customer feedback and rating analysis
- **Store Management**: Complete store profile and information management
- **Review Analytics**: Sentiment analysis and customer engagement metrics

#### Customer Experience Platform
- **Store Discovery**: Advanced search with geolocation and filtering
- **Rating System**: Sophisticated 5-star rating with review capabilities
- **Profile Management**: Secure account management with password updates
- **Personalized Experience**: Customized store recommendations

## 🚀 Quick Start Guide

### Prerequisites
```bash
Node.js >= 18.0.0
npm >= 8.0.0
```

### Installation & Setup

#### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd store-rating-system

# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install
```

#### 2. Environment Configuration
```bash
# Backend environment (.env)
PORT=3001
JWT_SECRET=your_secure_jwt_secret_key_here
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
```

#### 3. Database Initialization
```bash
# Automated database setup with sample data
cd backend
node init-db.js
```

#### 4. Application Launch
```bash
# Terminal 1 - Backend Server
cd backend
npm run dev

# Terminal 2 - Frontend Application
cd frontend
npm start
```

### 🎯 Access Credentials

| Role | Email | Password | Capabilities |
|------|-------|----------|-------------|
| **System Admin** | admin@system.com | Admin123! | Full system control |
| **Store Owner** | john@techstore.com | Admin123! | Store management |
| **Store Owner** | sarah@fashionboutique.com | Admin123! | Store management |
| **Customer** | alice@customer.com | User123! | Rating & reviews |
| **Customer** | bob@customer.com | User123! | Rating & reviews |

## 🔧 API Documentation

### Authentication Endpoints
```http
POST   /api/auth/register     # User registration with validation
POST   /api/auth/login        # JWT token authentication
PUT    /api/auth/password     # Secure password updates
```

### Administrative Operations
```http
GET    /api/admin/dashboard       # System analytics & metrics
GET    /api/admin/users          # User management with filters
GET    /api/admin/stores         # Store administration
GET    /api/admin/store-owners   # Store owner directory
POST   /api/admin/users          # User creation with role assignment
POST   /api/admin/stores         # Store registration
```

### Store Operations
```http
GET    /api/stores               # Store directory with search
POST   /api/stores/:id/rating    # Rating submission/updates
GET    /api/stores/:id/reviews   # Store review analytics
```

### Store Owner Portal
```http
GET    /api/store-owner/dashboard    # Performance analytics
POST   /api/store-owner/store        # Store profile management
```

## 🗄️ Database Architecture

### Optimized Schema Design
```sql
-- Users table with role-based constraints
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(60) CHECK (length(name) BETWEEN 20 AND 60),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(400),
    role VARCHAR(20) DEFAULT 'normal' CHECK (role IN ('admin', 'normal', 'store_owner')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Stores with owner relationships
CREATE TABLE stores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(60) CHECK (length(name) BETWEEN 20 AND 60),
    email VARCHAR(255) UNIQUE NOT NULL,
    address VARCHAR(400),
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Ratings with constraints and uniqueness
CREATE TABLE ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    review TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, store_id)
);
```

### Performance Optimizations
- **Strategic Indexing**: Optimized indexes on frequently queried columns
- **Foreign Key Constraints**: Referential integrity with cascade operations
- **Data Validation**: Database-level constraints for data consistency
- **Normalized Design**: Third normal form compliance for optimal performance

## 🛡️ Security Implementation

### Authentication & Authorization
- **JWT Tokens**: Stateless authentication with configurable expiration
- **Password Hashing**: bcrypt with salt rounds for enhanced security
- **Role-Based Access**: Middleware-enforced permission system
- **Token Refresh**: Automatic token management with interceptors

### Data Protection
- **Input Sanitization**: Comprehensive validation and sanitization
- **SQL Injection Prevention**: Parameterized queries throughout
- **XSS Protection**: Input encoding and output sanitization
- **CORS Configuration**: Secure cross-origin resource sharing

### Validation Framework
```javascript
// Advanced validation with custom middleware
const storeValidation = [
  body('name').isLength({ min: 20, max: 60 }),
  body('email').isEmail().normalizeEmail(),
  body('address').isLength({ max: 400 }).trim(),
  handleValidationErrors
];
```

## 📈 Performance Features

### Frontend Optimizations
- **Component Lazy Loading**: Code splitting for optimal bundle size
- **State Management**: Efficient React Context with custom hooks
- **HTTP Interceptors**: Automatic token management and error handling
- **Responsive Design**: Mobile-first approach with CSS Grid/Flexbox

### Backend Optimizations
- **Middleware Pipeline**: Efficient request processing with early returns
- **Database Indexing**: Strategic indexes for query optimization
- **Error Handling**: Comprehensive error middleware with logging
- **Async/Await**: Modern asynchronous programming patterns

## 🔄 Development Workflow

### Code Quality
- **Modular Architecture**: Separation of concerns with clear boundaries
- **Error Handling**: Comprehensive error management throughout
- **Validation Layers**: Client-side and server-side validation
- **Security Best Practices**: Industry-standard security implementations

### Scalability Considerations
- **Stateless Design**: JWT-based authentication for horizontal scaling
- **Database Optimization**: Indexed queries and normalized schema
- **Modular Components**: Reusable React components with props validation
- **API Design**: RESTful endpoints with consistent response formats

## 🎯 Production Readiness

### Enterprise Features
- ✅ **Role-Based Access Control** with granular permissions
- ✅ **Advanced Analytics Dashboard** with real-time metrics
- ✅ **Comprehensive Validation** at all application layers
- ✅ **Security Implementation** following industry standards
- ✅ **Scalable Architecture** with microservices principles
- ✅ **Performance Optimization** with strategic caching
- ✅ **Error Handling** with graceful degradation
- ✅ **Responsive Design** with cross-device compatibility
- ✅ **Database Optimization** with indexing strategies
- ✅ **API Documentation** with comprehensive endpoint coverage

### Quality Assurance
- **Input Validation**: Multi-layer validation with user feedback
- **Error Recovery**: Graceful error handling with user guidance
- **Performance Monitoring**: Optimized queries and response times
- **Security Auditing**: Regular security assessment and updates

---

*This application demonstrates enterprise-level full-stack development capabilities with modern technologies, security best practices, and scalable architecture patterns suitable for production deployment.*
