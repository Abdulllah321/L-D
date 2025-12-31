import CatalogView from '@/components/catalog/CatalogView';
import Designation from '@/models/Designation';
import Training from '@/models/Training';
import connectDB from '@/lib/mongodb';

export const dynamic = 'force-dynamic'; // Ensure fresh data

export default async function CatalogPage() {
    await connectDB();

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
