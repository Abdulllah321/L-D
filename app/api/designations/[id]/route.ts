import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Designation from '@/models/Designation';
import TrainingAssignment from '@/models/TrainingAssignment';
import { getAuthFromRequest } from '@/lib/auth';

// PUT update designation
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const auth = getAuthFromRequest(request);
    if (!auth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();
    
    // We update using the flexible ID field, not _id
    // But wait, the route param `id` might be the _id or the custom `id`.
    // The frontend passes `editingId` which usually comes from `_id` or `id`.
    // In `DesignationsPage`, `key={designation._id || designation.id}`.
    // The `handleDelete` uses `designation.id` (custom ID)?
    // Let's check `handleDelete` in page.tsx... it calls `/api/designations/${id}`.
    // It seems `Designation` model has a custom `id` field.
    // Let's support looking up by _id first, then custom id.
    
    let designation = await Designation.findById(id);
    if (!designation) {
        designation = await Designation.findOne({ id: id });
    }

    if (!designation) {
      return NextResponse.json(
        { error: 'Designation not found' },
        { status: 404 }
      );
    }

    // Update fields
    if (body.title) designation.title = body.title;
    if (body.subDesignations) designation.subDesignations = body.subDesignations;
    // Add other fields if necessary

    await designation.save();

    return NextResponse.json({ designation });
  } catch (error) {
    console.error('Error updating designation:', error);
    return NextResponse.json(
      { error: 'Failed to update designation' },
      { status: 500 }
    );
  }
}

// DELETE designation
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
     // Check authentication
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const auth = getAuthFromRequest(request);
    if (!auth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    let designation = await Designation.findById(id);
    if (!designation) {
        designation = await Designation.findOne({ id: id });
    }

    if (!designation) {
      return NextResponse.json(
        { error: 'Designation not found' },
        { status: 404 }
      );
    }

    // Delete the designation
    await designation.deleteOne();

    // Also delete associated assignments?
    // Ideally yes, to keep DB clean.
    await TrainingAssignment.deleteMany({ designationId: designation.id });

    return NextResponse.json({ message: 'Designation deleted successfully' });
  } catch (error) {
    console.error('Error deleting designation:', error);
    return NextResponse.json(
      { error: 'Failed to delete designation' },
      { status: 500 }
    );
  }
}
