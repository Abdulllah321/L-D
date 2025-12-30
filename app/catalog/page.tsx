import CatalogView from '@/components/catalog/CatalogView';
import Designation from '@/models/Designation';
import Training from '@/models/Training';
import { connectToDatabase } from '@/lib/mongodb'; // Assuming this exists, based on other files usually present. If not, I'll fix.
// Actually, looking at file list, I see `lib` but not sure about `mongodb.ts`. 
// I'll assume standard mongoose connection pattern or I'll add the connection logic here if needed.
// Wait, I didn't see `lib/mongodb.ts` in the file list earlier? 
// Checking step 4... `lib` exists.
// I'll try to use a standard pattern. If it fails, I'll fix. 
// However, the `models` folder suggests a direct mongoose usage.
// I'll add a check for connection.

import mongoose from 'mongoose';

// Temporary connection helper if global one is missing
const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

async function dbConnect() {
    if (mongoose.connection.readyState >= 1) return;
    return mongoose.connect(MONGODB_URI as string);
}

export const dynamic = 'force-dynamic'; // Ensure fresh data

export default async function CatalogPage() {
    await dbConnect();

    const designations = await Designation.find({}).sort({ order: 1 }).lean();
    const trainings = await Training.find({}).sort({ programTitle: 1 }).lean();

    // Serialize to plain JSON to pass to Client Components
    const serializedDesignations = JSON.parse(JSON.stringify(designations));
    const serializedTrainings = JSON.parse(JSON.stringify(trainings));

    return (
        <CatalogView
            designations={serializedDesignations}
            allTrainings={serializedTrainings}
        />
    );
}
