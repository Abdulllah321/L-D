import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import LearningDeck from '@/models/LearningDeck';

export async function GET() {
  try {
    await connectDB();
    const decks = await LearningDeck.find({})
      .sort({ createdAt: -1 })
      .lean();
      
    return NextResponse.json({ decks });
  } catch (error) {
    console.error("Error fetching learning decks:", error);
    return NextResponse.json(
      { error: "Failed to fetch learning decks" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, categories } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Format categories with generated IDs if not provided
    const formattedCategories = (categories || []).map((cat: any) => ({
      id: cat.id || cat.title.toUpperCase().replace(/\s+/g, '_'),
      title: cat.title,
      description: cat.description
    }));

    const newDeck = await LearningDeck.create({
      title,
      description,
      categories: formattedCategories
    });

    return NextResponse.json({ 
      message: "Learning Deck created successfully",
      deck: newDeck 
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating learning deck:", error);
    return NextResponse.json(
      { error: "Failed to create learning deck" },
      { status: 500 }
    );
  }
}
