import connectDB from '@/lib/mongodb';
import DesignationDetailView from '@/components/catalog/DesignationDetailView';
import Designation from '@/models/Designation';
import Training from '@/models/Training';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    await connectDB();
    const designations = await Designation.find({}, { id: 1 }).lean();
    return designations.map((d) => ({
        designationId: d.id,
    }));
}

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

interface PageProps {
    params: Promise<{ designationId: string }>;
}

export default async function DesignationPage({ params }: PageProps) {
    await connectDB();
    const { designationId } = await params;

    const designation = await Designation.findOne({ id: designationId }).lean();

    if (!designation) {
        notFound();
    }

    // Fetch all for Nav
    const allDesignations = await Designation.find({}, { id: 1, title: 1, order: 1 }).sort({ order: 1 }).lean();
    const currentIndex = allDesignations.findIndex(d => d.id === designationId);

    // Previous and Next Logic
    const prevDesignation = currentIndex > 0 ? allDesignations[currentIndex - 1] : null;
    const nextDesignation = currentIndex < allDesignations.length - 1 ? allDesignations[currentIndex + 1] : null;

    // Fetch all trainings to filter (or optimize this later to fetch strictly needed)
    // For SSG, fetching all once per build is fine
    const allTrainings = await Training.find({}).lean();

    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const dTitle = normalize(designation.title);

    const relatedTrainings = allTrainings.filter(t => {
        const tAudience = normalize(t.targetAudience);
        return tAudience.includes(dTitle) || dTitle.includes(tAudience) || tAudience.includes('all');
    });

    const serializedDesignation = JSON.parse(JSON.stringify(designation));
    const serializedTrainings = JSON.parse(JSON.stringify(relatedTrainings));

    const navData = {
        prev: prevDesignation ? { id: prevDesignation.id, title: prevDesignation.title } : null,
        next: nextDesignation ? { id: nextDesignation.id, title: nextDesignation.title } : null
    };

    return (
        <DesignationDetailView
            designation={serializedDesignation}
            trainings={serializedTrainings}
            navigation={navData}
        />
    );
}
