// Load environment variables from .env.local BEFORE importing anything that needs it
import { readFileSync } from 'fs';
import { resolve } from 'path';

try {
  const envPath = resolve(process.cwd(), '.env.local');
  const envFile = readFileSync(envPath, 'utf-8');
  envFile.split('\n').forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...values] = trimmedLine.split('=');
      if (key && values.length > 0) {
        const value = values.join('=').trim().replace(/^["']|["']$/g, '');
        if (!process.env[key.trim()]) {
          process.env[key.trim()] = value;
        }
      }
    }
  });
} catch (error) {
  console.warn('Could not load .env.local, using environment variables from system');
}

import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';
import Designation from '../models/Designation';

const designationsData = {
  "branchOperations": [
    {
      "title": "Service Ambassador",
      "order": 1,
      "subDesignations": [
        { "title": "Service Ambassador - Operations Track", "order": 1 },
        { "title": "Service Ambassador - Branch Distribution Track", "order": 2 }
      ]
    },
    {
      "title": "Branch Service Officer",
      "order": 2,
      "subDesignations": [
        { "title": "BSO - Fresh Graduate", "order": 1 },
        { "title": "BSO - Experienced", "order": 2 }
      ]
    },
    {
      "title": "General Banking Officer",
      "order": 3,
      "subDesignations": []
    },
    {
      "title": "Senior Branch Service Officer",
      "order": 4,
      "subDesignations": []
    },
    {
      "title": "Branch Service Manager",
      "order": 5,
      "subDesignations": [
        { "title": "BSM - Emerging BSM Track", "order": 1 }
      ]
    },
    {
      "title": "Branch Service Manager (Trade & SME)",
      "order": 6,
      "subDesignations": []
    },
    {
      "title": "Cluster Operations Manager",
      "order": 7,
      "subDesignations": []
    },
    {
      "title": "Area Operations Manager",
      "order": 8,
      "subDesignations": []
    },
    {
      "title": "Regional Operations Manager",
      "order": 9,
      "subDesignations": []
    }
  ]
};

async function seedDesignations() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const results = {
      created: [] as string[],
      skipped: [] as string[],
      errors: [] as string[],
    };

    for (const designationData of designationsData.branchOperations) {
      try {
        // Generate ID from title (uppercase, replace spaces with underscores)
        const id = designationData.title.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');

        // Check if designation already exists
        const existing = await Designation.findOne({ id });
        if (existing) {
          console.log(`Skipping ${designationData.title} - already exists`);
          results.skipped.push(designationData.title);
          continue;
        }

        // Transform subDesignations to include id field
        const subDesignations = (designationData.subDesignations || []).map((sub) => {
          const subId = sub.title.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');
          return {
            id: subId,
            title: sub.title,
          };
        });

        // Create designation
        const designation = new Designation({
          id,
          title: designationData.title,
          order: designationData.order,
          subDesignations,
        });

        await designation.save();
        console.log(`✓ Created: ${designationData.title} (${id})`);
        results.created.push(designationData.title);
      } catch (error: any) {
        console.error(`✗ Error creating ${designationData.title}:`, error.message);
        results.errors.push(`${designationData.title}: ${error.message}`);
      }
    }

    console.log('\n=== Seeding Summary ===');
    console.log(`Created: ${results.created.length}`);
    console.log(`Skipped: ${results.skipped.length}`);
    console.log(`Errors: ${results.errors.length}`);

    if (results.created.length > 0) {
      console.log('\nCreated Designations:');
      results.created.forEach((title) => console.log(`  - ${title}`));
    }

    if (results.skipped.length > 0) {
      console.log('\nSkipped (already exist):');
      results.skipped.forEach((title) => console.log(`  - ${title}`));
    }

    if (results.errors.length > 0) {
      console.log('\nErrors:');
      results.errors.forEach((error) => console.log(`  - ${error}`));
    }

    process.exit(0);
  } catch (error: any) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDesignations();
