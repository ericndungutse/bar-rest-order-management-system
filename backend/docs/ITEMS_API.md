# Items API Documentation

## Overview

The Items API provides role-based access to menu items in the bar/restaurant system. Users can view items based on their role and hierarchical relationships.

## Endpoints

### Get All Items

Retrieves items based on the authenticated user's role.

**Endpoint:** `GET /api/v1/items`

**Authentication:** Required (JWT Bearer token)

**Authorization:** Admin, Manager, Waiter

#### Role-Based Access

- **Admin**: Returns items owned by the admin
- **Manager**: Returns items owned by their boss (admin they work for)
- **Waiter**: Returns items owned by their boss (admin they work for)

#### Request Headers

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

#### Success Response (200 OK)

```json
{
  "status": "success",
  "count": 5,
  "data": [
    {
      "_id": "6923a3efa9c1bb3a00d14d33",
      "name": "Fanta Orange small",
      "description": "Small bottle of Fanta Orange soft drink",
      "price": 600,
      "quantity_available": 20,
      "category": "Drink",
      "owner": {
        "_id": "6923a3c237a23ad053af7060",
        "name": "Admin User",
        "email": "admin@yopmain.com",
        "roles": ["admin"]
      },
      "available": true,
      "createdAt": "2025-11-24T00:16:47.368Z",
      "updatedAt": "2025-11-24T00:16:47.368Z"
    }
  ]
}
```

#### Error Responses

**401 Unauthorized - No Token**
```json
{
  "status": "error",
  "message": "Not authorized, no token"
}
```

**401 Unauthorized - Invalid Token**
```json
{
  "status": "error",
  "message": "Not authorized, token failed"
}
```

**400 Bad Request - No Boss Assigned**
```json
{
  "status": "error",
  "message": "No boss assigned. Please contact administrator."
}
```

**400 Bad Request - Invalid Boss**
```json
{
  "status": "error",
  "message": "Invalid boss assignment. Please contact administrator."
}
```

**500 Internal Server Error**
```json
{
  "status": "error",
  "message": "Server error while fetching items"
}
```

## Usage Examples

### Step 1: Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@yopmain.com",
    "password": "Test@123"
  }'
```

**Response:**
```json
{
  "status": "success",
  "message": "Login Successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "user_id": "6923a3c237a23ad053af7060",
      "name": "Admin User",
      "email": "admin@yopmain.com",
      "roles": ["admin"]
    }
  }
}
```

### Step 2: Get Items

```bash
curl -X GET http://localhost:5000/api/v1/items \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

## Data Model

### Item Schema

| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Unique identifier |
| name | String | Item name (required) |
| description | String | Item description |
| price | Number | Item price (required, >= 0) |
| quantity_available | Number | Available quantity (required, >= 0) |
| category | String | Category: 'Food', 'Drink', or 'Dessert' (required) |
| owner | ObjectId | Reference to User (admin) who owns the item (required) |
| available | Boolean | Whether item is available (default: true) |
| createdAt | Date | Timestamp of creation |
| updatedAt | Date | Timestamp of last update |

### User Hierarchy

```
Admin (owner of items)
  ↓ (boss relationship)
Manager (can view admin's items)
  ↓ (boss relationship)
Waiter (can view admin's items)
```

## Test Credentials (Development Only)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@yopmain.com | Test@123 |
| Manager | manager@yopmain.com | Test@123 |
| Waiter | waiter@yopmain.com | Test@123 |

## Notes

- JWT tokens expire after 1 hour
- All items returned are sorted by creation date (newest first)
- The `owner` field is populated with user details (name, email, roles)
- Manager and waiter users must have a valid boss assignment to access items
- Rate limiting is not currently implemented but is recommended for production use
