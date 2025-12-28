import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TrainingAssignment from '@/models/TrainingAssignment';
import Training from '@/models/Training';
import { getAuthFromRequest } from '@/lib/auth';

// GET assignments (optionally filtered by designationId and trackType)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const designationId = searchParams.get('designationId');
    const trackType = searchParams.get('trackType');

    const query: any = {};
    if (designationId) {
      query.designationId = designationId.toUpperCase();
    }
    if (trackType) {
      query.trackType = trackType;
    }

    const assignments = await TrainingAssignment.find(query)
      .populate('trainingId')
      .sort({ designationId: 1, trackType: 1, order: 1 });

    // Transform to include training data
    const trainings = assignments.map((assignment: any) => ({
      _id: assignment.trainingId._id,
      assignmentId: assignment._id,
      programTitle: assignment.trainingId.programTitle,
      programObjective: assignment.trainingId.programObjective,
      trainingPartner: assignment.trainingId.trainingPartner,
      targetAudience: assignment.trainingId.targetAudience,
      durationFormat: assignment.trainingId.durationFormat,
      competencies: assignment.trainingId.competencies,
      outcomesBenefits: assignment.trainingId.outcomesBenefits,
      frequency: assignment.trainingId.frequency,
      assessmentFollowUp: assignment.trainingId.assessmentFollowUp,
      reviewDate: assignment.trainingId.reviewDate,
      schedule: assignment.trainingId.schedule,
      order: assignment.order,
      designationId: assignment.designationId,
      trackType: assignment.trackType,
    }));

    return NextResponse.json({ trainings }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching training assignments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training assignments' },
      { status: 500 }
    );
  }
}

// POST create new assignment (admin only)
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
    const { trainingId, designationId, trackType, order } = data;

    if (!trainingId || !designationId || !trackType) {
      return NextResponse.json(
        { error: 'trainingId, designationId, and trackType are required' },
        { status: 400 }
      );
    }

    // Check if training exists
    const training = await Training.findById(trainingId);
    if (!training) {
      return NextResponse.json(
        { error: 'Training not found' },
        { status: 404 }
      );
    }

    // Check for existing assignment
    const existing = await TrainingAssignment.findOne({
      trainingId,
      designationId: designationId.toUpperCase(),
      trackType,
    });

    if (existing) {
      return NextResponse.json(
        { error: 'This training is already assigned to this designation and track' },
        { status: 400 }
      );
    }

    // Get the highest order for this designation+track to append at the end
    const maxOrderResult = await TrainingAssignment.findOne({
      designationId: designationId.toUpperCase(),
      trackType,
    }).sort({ order: -1 });

    const nextOrder = maxOrderResult ? maxOrderResult.order + 1 : (order !== undefined ? parseInt(order) : 0);

    const assignment = await TrainingAssignment.create({
      trainingId,
      designationId: designationId.toUpperCase(),
      trackType,
      order: nextOrder,
    });

    const populated = await TrainingAssignment.findById(assignment._id).populate('trainingId');

    return NextResponse.json(
      { message: 'Training assigned successfully', assignment: populated },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating training assignment:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'This training is already assigned to this designation, track, and level' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create training assignment', details: error.message },
      { status: 500 }
    );
  }
}

