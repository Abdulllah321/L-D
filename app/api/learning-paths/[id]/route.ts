import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import LearningPath from '@/models/LearningPath';
import { getAuthFromRequest } from '@/lib/auth';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getAuthFromRequest(req);
    if (!auth || !auth.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await req.json();
    const { title, description, frequency, trainings, deckId, categoryId } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (!trainings || !Array.isArray(trainings) || trainings.length === 0) {
      return NextResponse.json(
        { error: "At least one training item is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Map trainings to ensure structure
    const formattedTrainings = trainings.map((t: any) => ({
      trainingId: t.trainingId || undefined,
      title: t.title,
      isPlaceholder: t.isPlaceholder || false,
      courseOverview: t.courseOverview || description,
      frequency: t.frequency || frequency
    }));

    const updatedLearningPath = await LearningPath.findByIdAndUpdate(
      id,
      {
        title,
        deckId: deckId || undefined,
        categoryId: categoryId || undefined,
        trainings: formattedTrainings
      },
      { new: true }
    ).populate('trainings.trainingId');

    if (!updatedLearningPath) {
      return NextResponse.json(
        { error: "Learning Path not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Learning Path updated successfully",
      learningPath: updatedLearningPath
    });

  } catch (error) {
    console.error("Error updating learning path:", error);
    return NextResponse.json(
      { error: "Failed to update learning path" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getAuthFromRequest(req);
    if (!auth || !auth.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    await connectDB();

    const deletedLearningPath = await LearningPath.findByIdAndDelete(id);

    if (!deletedLearningPath) {
      return NextResponse.json(
        { error: "Learning Path not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Learning Path deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting learning path:", error);
    return NextResponse.json(
      { error: "Failed to delete learning path" },
      { status: 500 }
    );
  }
}

