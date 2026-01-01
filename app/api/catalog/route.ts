import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Designation from '@/models/Designation';
import Training from '@/models/Training';
import TrainingAssignment from '@/models/TrainingAssignment';

export async function GET() {
    try {
        await connectDB();

        // Fetch all designations sorted by order
        const designations = await Designation.find({}).sort({ order: 1 }).lean();
        
        // Fetch all trainings
        const trainings = await Training.find({}).lean();

        // Fetch all training assignments
        const assignments = await TrainingAssignment.find({}).sort({ order: 1 }).lean();

        return NextResponse.json({
            designations,
            trainings,
            assignments
        });
    } catch (error) {
        console.error("Error fetching catalog data:", error);
        return NextResponse.json(
            { error: "Failed to fetch catalog data" },
            { status: 500 }
        );
    }
}
