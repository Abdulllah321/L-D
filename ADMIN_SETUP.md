# Admin Setup Guide

## Prerequisites

1. **MongoDB Database**
   - Sign up for a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
   - Create a new cluster
   - Get your connection string
   - Or use local MongoDB if you have it installed

## Setup Steps

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/learning-catalog?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

**Important**: Replace `username` and `password` with your MongoDB Atlas credentials, and use a strong random string for `JWT_SECRET` in production.

### 2. Initialize Admin User

After setting up MongoDB, create your first admin user by making a POST request to:

```
POST /api/admin/init
Content-Type: application/json

{
  "username": "admin",
  "password": "your-secure-password",
  "email": "admin@example.com"
}
```

**Note**: This endpoint only works if no admin exists. After the first admin is created, you must use the login endpoint.

You can use:
- Postman
- curl: `curl -X POST http://localhost:3000/api/admin/init -H "Content-Type: application/json" -d '{"username":"admin","password":"yourpassword"}'`
- Or create a simple script

### 3. Access Admin Dashboard

1. Navigate to `/admin` in your browser
2. Login with your admin credentials
3. Start managing designations!

## Features

- ✅ Secure authentication with JWT tokens
- ✅ Password hashing with bcrypt
- ✅ Full CRUD operations for designations
- ✅ Beautiful admin interface
- ✅ Real-time updates in the catalog
- ✅ Protected API routes

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Check authentication status

### Designations (Public Read, Admin Write)
- `GET /api/designations` - Get all designations
- `GET /api/designations/[id]` - Get single designation
- `POST /api/designations` - Create designation (Admin only)
- `PUT /api/designations/[id]` - Update designation (Admin only)
- `DELETE /api/designations/[id]` - Delete designation (Admin only)

### Admin
- `POST /api/admin/init` - Initialize first admin user

## Security Notes

- All admin routes are protected with JWT authentication
- Passwords are hashed using bcrypt
- JWT tokens are stored in HTTP-only cookies
- Change the default JWT_SECRET in production
- Use strong passwords for admin accounts

