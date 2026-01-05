import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Training from '@/models/Training';
import { getAuthFromRequest } from '@/lib/auth';

// GET all trainings (optionally filtered by designationId)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const trainings = await Training.find({})
      .sort({ programTitle: 1 });

    return NextResponse.json({ trainings }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching trainings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trainings' },
      { status: 500 }
    );
  }
}

// POST create new training (admin only)
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
    const {
      programTitle,
      programObjective,
      trainingPartner,
      targetAudience,
      durationFormat,
      isHalfDay,
      isOnline,
      prerequisites,
      competencies,
      outcomesBenefits,
      frequency,
      assessmentFollowUp,
      reviewDate,
      schedule,
    } = data;

    if (!programTitle) {
      return NextResponse.json(
        { error: 'Program title is required' },
        { status: 400 }
      );
    }

    const trainingData: any = {
      programTitle,
      programObjective: programObjective || '',
      trainingPartner: trainingPartner || '',
      targetAudience: targetAudience || '',
      durationFormat: durationFormat || '',
      isHalfDay: isHalfDay || false,
      isOnline: isOnline || false,
      prerequisites: prerequisites || '',
      competencies: competencies || {},
      outcomesBenefits: outcomesBenefits || '',
      frequency: frequency || '',
      assessmentFollowUp: assessmentFollowUp || '',
      reviewDate: reviewDate || '',
      schedule: schedule || [],
    };


    // Use create() instead of new + save() to avoid validation issues with optional fields
    // create() handles validation better for optional fields
    const training = await Training.create(trainingData);

    return NextResponse.json(
      { message: 'Training created successfully', training },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating training:', error);
    
    // Provide more detailed error information
    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors || {}).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationErrors,
          fullError: error.message 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create training',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
