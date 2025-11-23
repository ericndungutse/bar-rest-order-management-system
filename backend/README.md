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

The server will start on `http://localhost:5000` (or the port specified in your .env file).

## API Endpoints

### Base URL
- `GET /` - Welcome message and API status

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
├── middleware/      # Custom middleware
├── models/         # Mongoose models
├── routes/         # API routes
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
- **dotenv** - Environment variable management
- **cors** - Cross-Origin Resource Sharing
- **nodemon** - Development auto-reload

## Contributing

Please follow the existing code structure and naming conventions when adding new features.
