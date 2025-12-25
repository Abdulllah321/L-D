import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Designation from '@/models/Designation';
import { getAuthFromRequest } from '@/lib/auth';

// GET all designations (public)
export async function GET() {
  try {
    await connectDB();

    const designations = await Designation.find({}).sort({ id: 1 });

    return NextResponse.json({ designations }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching designations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch designations' },
      { status: 500 }
    );
  }
}

// POST create new designation (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication via cookie
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const auth = getAuthFromRequest(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const data = await request.json();
    const { id, title, summary, iconName, coreTrainings, refreshers } = data;

    if (!id || !title || !summary || !iconName || coreTrainings === undefined || refreshers === undefined) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if designation with same id already exists
    const existing = await Designation.findOne({ id: id.toUpperCase() });
    if (existing) {
      return NextResponse.json(
        { error: 'Designation with this ID already exists' },
        { status: 400 }
      );
    }

    const designation = new Designation({
      id: id.toUpperCase(),
      title,
      summary,
      iconName,
      coreTrainings: parseInt(coreTrainings),
      refreshers: parseInt(refreshers),
    });

    await designation.save();

    return NextResponse.json(
      { message: 'Designation created successfully', designation },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating designation:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Designation with this ID already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create designation' },
      { status: 500 }
    );
  }
}

