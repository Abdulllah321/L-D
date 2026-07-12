"use server";

import { prisma } from "@/lib/prisma";

export interface RetailLearningTrack {
  id: string;
  name: string;
}

export interface RetailJobFamily {
  id: string;
  name: string;
  learningTracks: RetailLearningTrack[];
}

export interface RetailDepartmentData {
  id: string;
  name: string;
  code: string;
  jobFamilies: RetailJobFamily[];
}

const FALLBACK_RETAIL_DATA: RetailDepartmentData = {
  id: "fallback-retail-id",
  name: "Retail Catalog",
  code: "RETAIL",
  jobFamilies: [
    {
      id: "fallback-ro-id",
      name: "Relationship Officer",
      learningTracks: [
        { id: "ro-t1", name: "Blended Jumpstart Program" },
        { id: "ro-t2", name: "New Product Launches" },
        { id: "ro-t3", name: "Serving with Joy" },
        { id: "ro-t4", name: "Selling Skills" }
      ]
    },
    {
      id: "fallback-srm-id",
      name: "Senior Relationship Manager",
      learningTracks: [
        { id: "srm-t1", name: "Blended Jumpstart Program" },
        { id: "srm-t2", name: "New Product Launches" },
        { id: "srm-t3", name: "Serving with Joy" },
        { id: "srm-t4", name: "Selling Skills" },
        { id: "srm-t5", name: "Masawat Champion Training" },
        { id: "srm-t6", name: "Pool Management Training" }
      ]
    }
  ]
};

export async function getRetailCatalogData(): Promise<RetailDepartmentData> {
  try {
    // Attempt to fetch from database
    const department = await prisma.department.findUnique({
      where: { code: "RETAIL" },
      include: {
        jobFamilies: {
          include: {
            learningTracks: {
              orderBy: { name: "asc" }
            }
          },
          orderBy: { name: "asc" }
        }
      }
    });

    if (!department) {
      console.warn("Retail Department not found in database. Falling back to static sample data.");
      return FALLBACK_RETAIL_DATA;
    }

    return {
      id: department.id,
      name: department.name,
      code: department.code,
      jobFamilies: department.jobFamilies.map((jf) => ({
        id: jf.id,
        name: jf.name,
        learningTracks: jf.learningTracks.map((lt) => ({
          id: lt.id,
          name: lt.name
        }))
      }))
    };
  } catch (error) {
    console.error("Failed to query Retail Catalog from database. Error details:", error);
    console.warn("Falling back to static sample data.");
    return FALLBACK_RETAIL_DATA;
  }
}
