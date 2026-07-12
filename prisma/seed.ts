import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const retailData = [
  {
    jobFamily: "Relationship Officer",
    learningTracks: [
      "Blended Jumpstart Program",
      "New Product Launches",
      "Serving with Joy",
      "Selling Skills"
    ]
  },
  {
    jobFamily: "Senior Relationship Manager",
    learningTracks: [
      "Blended Jumpstart Program",
      "New Product Launches",
      "Serving with Joy",
      "Selling Skills",
      "Masawat Champion Training",
      "Pool Management Training"
    ]
  }
];

async function main() {
  console.log("Seeding started...");

  // Upsert the Retail department
  const retailDept = await prisma.department.upsert({
    where: { code: 'RETAIL' },
    update: {},
    create: {
      code: 'RETAIL',
      name: 'Retail Catalog',
    },
  });

  console.log(`Upserted Department: ${retailDept.name} (${retailDept.code})`);

  for (const item of retailData) {
    // Create or find the Job Family
    const jobFamily = await prisma.jobFamily.upsert({
      where: {
        name_departmentId: {
          name: item.jobFamily,
          departmentId: retailDept.id,
        },
      },
      update: {},
      create: {
        name: item.jobFamily,
        departmentId: retailDept.id,
      },
    });

    console.log(`  Upserted Job Family: ${jobFamily.name}`);

    // Create the Learning Tracks for this Job Family
    for (const trackName of item.learningTracks) {
      await prisma.learningTrack.upsert({
        where: {
          name_jobFamilyId: {
            name: trackName,
            jobFamilyId: jobFamily.id,
          },
        },
        update: {},
        create: {
          name: trackName,
          jobFamilyId: jobFamily.id,
        },
      });
      console.log(`    Upserted Learning Track: ${trackName}`);
    }
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
