import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Designation from '@/models/Designation';
import { getAuthFromRequest } from '@/lib/auth';

// POST bulk create designations (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const auth = getAuthFromRequest(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { designations } = await request.json();

    if (!Array.isArray(designations) || designations.length === 0) {
      return NextResponse.json(
        { error: 'Designations array is required' },
        { status: 400 }
      );
    }

    const results = {
      created: [] as any[],
      skipped: [] as string[],
      errors: [] as string[],
    };

    for (const item of designations) {
      const name = item.name || item.title || item.id;
      
      if (!name || typeof name !== 'string' || name.trim() === '') {
        results.errors.push(`Invalid name: ${name}`);
        continue;
      }

      const trimmedName = name.trim();
      const id = trimmedName.toUpperCase().replace(/\s+/g, '_');
      const title = trimmedName;

      try {
        // Check if designation already exists
        const existing = await Designation.findOne({ id });
        if (existing) {
          results.skipped.push(id);
          continue;
        }

        // Create new designation with default values
        const designation = new Designation({
          id,
          title,
          summary: item.summary || `Training pathway for ${title}`,
          iconName: item.iconName || 'Book',
          coreTrainings: item.coreTrainings || 0,
          refreshers: item.refreshers || 0,
        });

        await designation.save();
        results.created.push(designation);
      } catch (error: any) {
        if (error.code === 11000) {
          results.skipped.push(id);
        } else {
          results.errors.push(`${name}: ${error.message}`);
        }
      }
    }

    return NextResponse.json(
      {
        message: `Bulk upload completed. Created: ${results.created.length}, Skipped: ${results.skipped.length}, Errors: ${results.errors.length}`,
        results,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in bulk upload:', error);
    return NextResponse.json(
      { error: 'Failed to process bulk upload' },
      { status: 500 }
    );
  }
}

