import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Designation from '@/models/Designation';
import { getAuthFromRequest } from '@/lib/auth';

// GET single designation (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const designation = await Designation.findOne({ id: params.id.toUpperCase() });

    if (!designation) {
      return NextResponse.json(
        { error: 'Designation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ designation }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching designation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch designation' },
      { status: 500 }
    );
  }
}

// PUT update designation (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = getAuthFromRequest(request);

    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const data = await request.json();
    const { title, summary, iconName, coreTrainings, refreshers } = data;

    // Try to find by _id first, then by id field
    let designation = await Designation.findById(params.id);
    
    if (!designation) {
      designation = await Designation.findOne({ id: params.id.toUpperCase() });
    }

    if (!designation) {
      return NextResponse.json(
        { error: 'Designation not found' },
        { status: 404 }
      );
    }

    // Update fields (supporting both simplified and legacy fields)
    if (title !== undefined) designation.title = title;
    if (summary !== undefined) designation.summary = summary;
    if (iconName !== undefined) designation.iconName = iconName;
    if (coreTrainings !== undefined) designation.coreTrainings = parseInt(coreTrainings);
    if (refreshers !== undefined) designation.refreshers = parseInt(refreshers);

    await designation.save();

    return NextResponse.json(
      { message: 'Designation updated successfully', designation },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating designation:', error);
    return NextResponse.json(
      { error: 'Failed to update designation' },
      { status: 500 }
    );
  }
}

// DELETE designation (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = getAuthFromRequest(request);

    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Try to find by _id first, then by id field
    let designation = await Designation.findByIdAndDelete(params.id);
    
    if (!designation) {
      designation = await Designation.findOneAndDelete({ id: params.id.toUpperCase() });
    }

    if (!designation) {
      return NextResponse.json(
        { error: 'Designation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Designation deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting designation:', error);
    return NextResponse.json(
      { error: 'Failed to delete designation' },
      { status: 500 }
    );
  }
}

