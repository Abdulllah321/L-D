import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Designation from '@/models/Designation';
import { getAuthFromRequest } from '@/lib/auth';
import mongoose from 'mongoose';

// POST bulk reorder designations (admin only)
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
    const { items } = data; // Array of { id: string, order: number }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items array is required' },
        { status: 400 }
      );
    }

    // Update all designations in a single operation
    const bulkOps = items.map((item: { id: string; order: number }) => {
      // Try to parse as ObjectId, if it fails, treat as string id field
      const isObjectId = mongoose.Types.ObjectId.isValid(item.id);
      const filter: any = {};
      
      if (isObjectId) {
        filter._id = new mongoose.Types.ObjectId(item.id);
      } else {
        filter.id = item.id.toUpperCase();
      }

      return {
        updateOne: {
          filter,
          update: {
            $set: { order: item.order }
          }
        }
      };
    });

    const result = await Designation.bulkWrite(bulkOps);

    return NextResponse.json(
      { 
        message: 'Designations reordered successfully',
        modifiedCount: result.modifiedCount 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error reordering designations:', error);
    return NextResponse.json(
      { error: 'Failed to reorder designations' },
      { status: 500 }
    );
  }
}

