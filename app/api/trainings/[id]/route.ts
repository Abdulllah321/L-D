import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Training from '@/models/Training';
import { getAuthFromRequest } from '@/lib/auth';

// GET single training
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const training = await Training.findById(id);
    if (!training) {
      return NextResponse.json(
        { error: 'Training not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ training }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching training:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training' },
      { status: 500 }
    );
  }
}

// PUT update training (admin only)
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
    const {
      programTitle,
      programObjective,
      trainingPartner,
      targetAudience,
      durationFormat,
      competencies,
      outcomesBenefits,
      frequency,
      assessmentFollowUp,
      reviewDate,
      schedule,
      isHalfDay,
      isOnline,
      prerequisites,
    } = data;

    let training = await Training.findById(id);

    if (!training) {
      return NextResponse.json(
        { error: 'Training not found' },
        { status: 404 }
      );
    }

    if (programTitle) training.programTitle = programTitle;
    if (programObjective !== undefined) training.programObjective = programObjective;
    if (trainingPartner !== undefined) training.trainingPartner = trainingPartner;
    if (targetAudience !== undefined) training.targetAudience = targetAudience;
    if (durationFormat !== undefined) training.durationFormat = durationFormat;
    if (isHalfDay !== undefined) training.isHalfDay = isHalfDay;
    if (isOnline !== undefined) training.isOnline = isOnline;
    if (prerequisites !== undefined) training.prerequisites = prerequisites;
    if (competencies) training.competencies = competencies;
    if (outcomesBenefits !== undefined) training.outcomesBenefits = outcomesBenefits;
    if (frequency !== undefined) training.frequency = frequency;
    if (assessmentFollowUp !== undefined) training.assessmentFollowUp = assessmentFollowUp;
    if (reviewDate !== undefined) training.reviewDate = reviewDate;
    if (schedule) training.schedule = schedule;

    await training.save();

    return NextResponse.json(
      { message: 'Training updated successfully', training },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating training:', error);
    return NextResponse.json(
      { error: 'Failed to update training' },
      { status: 500 }
    );
  }
}

// DELETE training (admin only)
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
    const training = await Training.findByIdAndDelete(id);

    if (!training) {
      return NextResponse.json(
        { error: 'Training not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Training deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting training:', error);
    return NextResponse.json(
      { error: 'Failed to delete training' },
      { status: 500 }
    );
  }
}
