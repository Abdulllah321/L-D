import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';

// Initialize admin user (only works if no admin exists)
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Check if any admin exists
    const adminCount = await Admin.countDocuments();
    
    if (adminCount > 0) {
      return NextResponse.json(
        { error: 'Admin already exists. Use login endpoint.' },
        { status: 400 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (error: any) {
      console.error('JSON parsing error:', error.message);
      return NextResponse.json(
        { error: 'Invalid JSON in request body', details: error.message },
        { status: 400 }
      );
    }

    const { username, password, email } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const admin = new Admin({
      username: username.toLowerCase(),
      password,
      email: email?.toLowerCase(),
    });

    await admin.save();

    return NextResponse.json(
      { message: 'Admin user created successfully', username: admin.username },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating admin:', error);
    console.error('Error stack:', error.stack);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      );
    }

    // Provide more detailed error in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error.message || 'Failed to create admin user'
      : 'Failed to create admin user';

    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

