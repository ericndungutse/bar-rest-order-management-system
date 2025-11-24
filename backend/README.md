# Bar & Restaurant Order Management System - Backend

This is the backend API for the Bar & Restaurant Order Management System built with Express.js and MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
   - Set your MongoDB connection string in `MONGODB_URI`
   - Adjust `PORT` if needed (default is 5000)

## Running the Application

### Development mode (with hot reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

### Seed the database with test users:
```bash
npm run seed
```

This will create three test users:
- **Admin User** (admin@yopmain.com) - Password: Test@123
- **Manager User** (manager@yopmain.com) - Password: Test@123
- **Waiter User** (waiter@yopmain.com) - Password: Test@123

### Seed the database with items:
```bash
npm run seed:items
```

This will create items for the admin user (ID: 6923914c954a9bdea72eafea):
- **Soft Drinks:**
  - Fanta Orange small (20 pieces @ 600 RWF each)
  - Coca Cola small (20 pieces @ 600 RWF each)
- **Beer:**
  - Mutzing small (20 pieces @ 800 RWF each)
  - Primus Nini (20 pieces @ 800 RWF each)
  - Heineken (20 pieces @ 1000 RWF each)

The server will start on `http://localhost:5000` (or the port specified in your .env file).

## API Endpoints

### Base URL
- `GET /` - Welcome message and API status
- `GET /health` - Health check endpoint (shows server and database status)

### Authentication
- `POST /api/v1/auth/login` - Login with email and password

#### Login Example
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "waiter@yopmain.com", "password": "Test@123"}'
```

**Response:**
```json
{
  "status": "success",
  "message": "Login Successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "user_id": "716cdea8-f82b-4205-b7f3-d05ad2b88679",
      "name": "Waiter User",
      "email": "waiter@yopmain.com",
      "roles": ["waiter"]
    }
  }
}
```

### Future Endpoints
- `/api/orders` - Order management endpoints
- `/api/menu` - Menu item management endpoints
- `/api/tables` - Table management endpoints

## Project Structure

```
backend/
├── config/          # Configuration files
│   └── db.js       # MongoDB connection
├── controllers/     # Route controllers
│   └── authController.js  # Authentication controller
├── middleware/      # Custom middleware
├── models/         # Mongoose models
│   ├── User.js     # User model
│   └── ...
├── routes/         # API routes
│   └── auth.routes.js  # Authentication routes
├── seeders/        # Database seeders
│   ├── seedUsers.js    # User seeder
│   └── seedItems.js    # Item seeder
├── .env.example    # Environment variables template
├── .gitignore      # Git ignore rules
├── package.json    # Dependencies and scripts
└── server.js       # Application entry point
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT authentication (for future use)

## Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variable management
- **cors** - Cross-Origin Resource Sharing
- **nodemon** - Development auto-reload

## Contributing

Please follow the existing code structure and naming conventions when adding new features.
