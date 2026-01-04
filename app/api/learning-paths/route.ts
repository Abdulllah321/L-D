import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import LearningPath from '@/models/LearningPath';

export async function GET() {
  try {
    await connectDB();
    // Populate training details for the trainings array
    const learningPaths = await LearningPath.find({})
      .populate('trainings.trainingId')
      .sort({ createdAt: -1 })
      .lean();
      
    return NextResponse.json({ learningPaths });
  } catch (error) {
    console.error("Error fetching learning paths:", error);
    return NextResponse.json(
      { error: "Failed to fetch learning paths" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
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

    // Map trainings to ensure structure and apply top level defaults
    // User requested top level description/frequency to be applied to items and NOT saved on top level
    const formattedTrainings = trainings.map((t: any) => ({
      trainingId: t.trainingId || undefined,
      title: t.title,
      isPlaceholder: t.isPlaceholder || false,
      courseOverview: t.courseOverview || description,
      frequency: t.frequency || frequency
    }));

    const newLearningPath = await LearningPath.create({
      title,
      deckId: deckId || undefined,
      categoryId: categoryId || undefined,
      // description and frequency intentionally omitted from top level to avoid redundancy default saving
      trainings: formattedTrainings
    });

    return NextResponse.json({ 
      message: "Learning Path created successfully",
      learningPath: newLearningPath 
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating learning path:", error);
    return NextResponse.json(
      { error: "Failed to create learning path" },
      { status: 500 }
    );
  }
}
