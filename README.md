# 🏫 School Management API

A RESTful API built with **Node.js**, **Express.js**, and **MySQL** to manage school data. Supports adding schools and listing them sorted by proximity using the Haversine formula.

---

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Setup](#database-setup)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Postman Collection](#postman-collection)
- [Deployment](#deployment)
- [Error Codes](#error-codes)

---

## ✨ Features
- Add schools with full input validation
- List all schools sorted by distance from a user-specified location
- Haversine-formula distance calculation (accurate great-circle distance)
- Structured JSON responses with clear error messages
- Production-ready error handling and connection pooling

---

## 🛠 Tech Stack
| Layer       | Technology              |
|-------------|-------------------------|
| Runtime     | Node.js 18+             |
| Framework   | Express.js 4.x          |
| Database    | MySQL 8.x               |
| ORM/Driver  | mysql2 (promise-based)  |
| Validation  | express-validator       |
| Environment | dotenv                  |

---

## 📁 Project Structure
```
school-management-api/
├── server.js                          # Entry point
├── schema.sql                         # Database schema + sample data
├── .env.example                       # Environment variable template
├── SchoolManagementAPI.postman_collection.json
├── package.json
└── src/
    ├── app.js                         # Express app setup
    ├── config/
    │   └── database.js                # MySQL connection pool
    ├── controllers/
    │   └── schoolController.js        # Route handlers
    ├── middleware/
    │   ├── validators.js              # express-validator rules
    │   └── errorHandler.js            # Global error handler
    ├── models/
    │   └── schoolModel.js             # DB operations
    ├── routes/
    │   └── schoolRoutes.js            # Route definitions
    └── utils/
        └── distance.js                # Haversine formula
```

---

## 🗄 Database Setup

### 1. Create Database & Table
Run the provided SQL schema file in your MySQL client:

```bash
mysql -u root -p < schema.sql
```

This creates:
- `school_management` database
- `schools` table with `id`, `name`, `address`, `latitude`, `longitude`, `created_at`, `updated_at`
- 10 sample schools across the USA for testing

### Table Schema
```sql
CREATE TABLE schools (
  id          INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255)  NOT NULL,
  address     VARCHAR(500)  NOT NULL,
  latitude    FLOAT         NOT NULL,
  longitude   FLOAT         NOT NULL,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_coordinates (latitude, longitude)
);
```

---

## 🚀 Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd school-management-api

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your MySQL credentials

# 4. Initialize the database
mysql -u root -p < schema.sql

# 5. Start the server
node server.js
# or for development with auto-restart:
npx nodemon server.js
```

The API will be available at `http://localhost:3000`

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and configure:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_management
```

---

## 📡 API Reference

### Health Check
```
GET /health
```
**Response:**
```json
{ "status": "OK", "message": "School Management API is running" }
```

---

### POST /addSchool
Add a new school to the database.

**Request Body** (`Content-Type: application/json`):
```json
{
  "name":      "Springfield Elementary",
  "address":   "742 Evergreen Terrace, Springfield, IL 62701",
  "latitude":  39.7817,
  "longitude": -89.6501
}
```

**Validation Rules:**
| Field       | Type   | Rules                              |
|-------------|--------|------------------------------------|
| `name`      | String | Required, non-empty, max 255 chars |
| `address`   | String | Required, non-empty, max 500 chars |
| `latitude`  | Float  | Required, between -90 and 90       |
| `longitude` | Float  | Required, between -180 and 180     |

**Success Response `201`:**
```json
{
  "success": true,
  "message": "School added successfully",
  "data": {
    "id": 11,
    "name": "Springfield Elementary",
    "address": "742 Evergreen Terrace, Springfield, IL 62701",
    "latitude": 39.7817,
    "longitude": -89.6501,
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Validation Error `422`:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "name", "message": "Name is required" }
  ]
}
```

---

### GET /listSchools
Fetch all schools sorted by proximity to the user's location.

**Query Parameters:**
| Parameter   | Type  | Required | Description             |
|-------------|-------|----------|-------------------------|
| `latitude`  | Float | ✅        | User's latitude (-90–90)  |
| `longitude` | Float | ✅        | User's longitude (-180–180) |

**Example:**
```
GET /listSchools?latitude=40.7128&longitude=-74.0060
```

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Schools retrieved and sorted by proximity",
  "userLocation": { "latitude": 40.7128, "longitude": -74.006 },
  "total": 10,
  "data": [
    {
      "id": 1,
      "name": "Greenwood High School",
      "address": "123 Elm Street, New York, NY 10001",
      "latitude": 40.7128,
      "longitude": -74.006,
      "distance_km": 0
    },
    {
      "id": 6,
      "name": "Westview Elementary",
      "address": "987 Cedar Lane, Philadelphia, PA 19101",
      "latitude": 39.9526,
      "longitude": -75.1652,
      "distance_km": 130.4821
    }
  ]
}
```

> `distance_km` is the Haversine great-circle distance from the user's coordinates.

---

## 📮 Postman Collection

Import `SchoolManagementAPI.postman_collection.json` into Postman.

The collection includes:
- ✅ Health check
- ✅ Add school (valid payload)
- ✅ Add school (missing name — 422)
- ✅ Add school (invalid coordinates — 422)
- ✅ List schools near New York
- ✅ List schools near Los Angeles
- ✅ List schools (missing latitude — 422)

**To import:** Open Postman → Import → Upload file → select `SchoolManagementAPI.postman_collection.json`  
Then set the `baseUrl` collection variable to your deployed URL.

---

## 🌐 Deployment

### Option A: Railway (Recommended — Free tier available)
1. Push your code to GitHub
2. Connect repo to [railway.app](https://railway.app)
3. Add a MySQL plugin
4. Set environment variables in Railway dashboard
5. Deploy — Railway auto-detects Node.js and runs `node server.js`

### Option B: Render
1. Push to GitHub
2. Create a new Web Service on [render.com](https://render.com)
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add environment variables
6. Use PlanetScale or a Render MySQL add-on for the database

### Option C: AWS EC2 + RDS
1. Launch an EC2 instance (t2.micro free tier)
2. Create an RDS MySQL instance
3. SSH into EC2, clone repo, configure `.env`
4. Run with PM2: `pm2 start server.js --name school-api`
5. Configure security groups to expose port 3000 (or use Nginx reverse proxy on 80/443)

---

## ❌ Error Codes

| Code | Meaning                          |
|------|----------------------------------|
| 200  | Success                          |
| 201  | School created                   |
| 404  | Route not found                  |
| 422  | Validation error                 |
| 500  | Internal server error            |
| 503  | Database unavailable             |

---

## 📐 Distance Algorithm

Schools are sorted using the **Haversine formula**, which calculates the shortest distance over the Earth's surface between two lat/lon points:

```
a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)
c = 2 × atan2(√a, √(1−a))
d = R × c   (R = 6371 km)
```

This gives accurate results for geographic distances without requiring a GIS extension.
