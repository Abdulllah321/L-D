import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TrainingAssignment from '@/models/TrainingAssignment';
import { getAuthFromRequest } from '@/lib/auth';

// PUT update assignment (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const data = await request.json();
    const { order } = data;

    const assignment = await TrainingAssignment.findById(id);

    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    if (order !== undefined && order !== null) {
      assignment.order = parseInt(order.toString());
    }

    await assignment.save();

    return NextResponse.json(
      { message: 'Assignment updated successfully', assignment },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating assignment:', error);
    return NextResponse.json(
      { error: 'Failed to update assignment' },
      { status: 500 }
    );
  }
}

// DELETE assignment (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const assignment = await TrainingAssignment.findByIdAndDelete(id);

    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Assignment deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting assignment:', error);
    return NextResponse.json(
      { error: 'Failed to delete assignment' },
      { status: 500 }
    );
  }
}

