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
    const { order, trackType, annualType, subDesignationId } = data;

    const assignment = await TrainingAssignment.findById(id);

    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    // Update order if provided
    if (order !== undefined && order !== null) {
      assignment.order = parseInt(order.toString());
    }

    // Update trackType if provided
    if (trackType !== undefined) {
      if (trackType !== 'normal' && trackType !== 'hi-po') {
        return NextResponse.json(
          { error: 'trackType must be either "normal" or "hi-po"' },
          { status: 400 }
        );
      }
      assignment.trackType = trackType;
    }

    // Update annualType if provided
    if (annualType !== undefined) {
      if (annualType !== null && annualType !== 'annual-regular' && annualType !== 'annual-ecourse') {
        return NextResponse.json(
          { error: 'annualType must be either "annual-regular", "annual-ecourse", or null' },
          { status: 400 }
        );
      }
      assignment.annualType = annualType || null;
    }

    // Update subDesignationId if provided
    if (subDesignationId !== undefined) {
      assignment.subDesignationId = subDesignationId ? subDesignationId.toUpperCase() : undefined;
    }

    await assignment.save();

    const populated = await TrainingAssignment.findById(assignment._id)
      .populate('trainingId')
      .populate('learningPathId');

    return NextResponse.json(
      { message: 'Assignment updated successfully', assignment: populated },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating assignment:', error);
    return NextResponse.json(
      { error: 'Failed to update assignment', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/training-assignments/[id]
 * 
 * Delete a training assignment (admin only)
 * 
 * Returns: { message: string }
 */
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

