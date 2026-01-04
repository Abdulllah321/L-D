import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import TrainingAssignment from "@/models/TrainingAssignment";

/**
 * Training Assignments Reorder API
 * 
 * POST /api/training-assignments/reorder
 * 
 * Bulk reorder training assignments (admin only)
 * Used for drag-and-drop reordering of assignments
 * 
 * Request Body:
 * {
 *   items: Array<{ assignmentId: string, order: number }>
 * }
 * 
 * Returns: { message: string, modifiedCount: number }
 */
export async function POST(request: NextRequest) {
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
    const { items } = data; // Array of { assignmentId: string, order: number }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items array is required' },
        { status: 400 }
      );
    }

    // Update all assignments in a single operation
    const bulkOps = items.map((item: { assignmentId: string; order: number }) => ({
      updateOne: {
        filter: { _id: item.assignmentId },
        update: {
          $set: { order: item.order }
        }
      }
    }));

    const result = await TrainingAssignment.bulkWrite(bulkOps);

    return NextResponse.json(
      { 
        message: 'Training assignments reordered successfully',
        modifiedCount: result.modifiedCount 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error reordering training assignments:', error);
    return NextResponse.json(
      { error: 'Failed to reorder training assignments' },
      { status: 500 }
    );
  }
}

