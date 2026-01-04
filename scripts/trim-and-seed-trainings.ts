// Load environment variables from .env.local BEFORE importing anything that needs it
import { readFileSync, writeFileSync } from 'fs';
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
import Training from '../models/Training';

/**
 * Recursively trim all string fields in an object
 */
function trimStringFields(obj: any): any {
  if (typeof obj === 'string') {
    return obj.trim();
  } else if (Array.isArray(obj)) {
    return obj.map(item => trimStringFields(item));
  } else if (obj !== null && typeof obj === 'object') {
    const trimmed: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip MongoDB _id fields
      if (key === '_id' && value && typeof value === 'object' && '$oid' in value) {
        continue; // Skip MongoDB ObjectId format
      }
      trimmed[key] = trimStringFields(value);
    }
    return trimmed;
  }
  return obj;
}

async function trimAndSeedTrainings() {
  try {
    const filePath = resolve(process.cwd(), '../../test.trainings.json');
    
    console.log('Reading JSON file...');
    const fileContent = readFileSync(filePath, 'utf-8');
    let trainingsData = JSON.parse(fileContent);

    console.log('Trimming all string fields...');
    trainingsData = trimStringFields(trainingsData);

    // Remove _id fields (MongoDB will generate new ones)
    trainingsData = trainingsData.map((training: any) => {
      const { _id, ...trainingData } = training;
      return trainingData;
    });

    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Connected to MongoDB');

    const results = {
      created: 0,
      skipped: 0,
      errors: [] as string[],
    };

    console.log(`\nProcessing ${trainingsData.length} trainings...`);

    for (let i = 0; i < trainingsData.length; i++) {
      const trainingData = trainingsData[i];
      try {
        // Check if training with same programTitle already exists
        const existing = await Training.findOne({ programTitle: trainingData.programTitle });
        if (existing) {
          console.log(`[${i + 1}/${trainingsData.length}] Skipping "${trainingData.programTitle}" - already exists`);
          results.skipped++;
          continue;
        }

        // Remove order field if present (not in schema)
        const { order, ...trainingToSave } = trainingData;

        // Ensure schedule array is properly formatted
        if (trainingToSave.schedule && Array.isArray(trainingToSave.schedule)) {
          trainingToSave.schedule = trainingToSave.schedule.map((day: any) => {
            // Trim presenter fields
            if (day.presenters) {
              const presenters: any = {};
              if (day.presenters.north) presenters.north = day.presenters.north.trim();
              if (day.presenters.centralI) presenters.centralI = day.presenters.centralI.trim();
              if (day.presenters.centralII) presenters.centralII = day.presenters.centralII.trim();
              if (day.presenters.south) presenters.south = day.presenters.south.trim();
              day.presenters = presenters;
            }
            return day;
          });
        }

        // Create training
        const training = new Training(trainingToSave);
        await training.save();

        console.log(`[${i + 1}/${trainingsData.length}] ✓ Created: "${trainingData.programTitle}"`);
        results.created++;
      } catch (error: any) {
        const errorMsg = `"${trainingData.programTitle}": ${error.message}`;
        console.error(`[${i + 1}/${trainingsData.length}] ✗ Error: ${errorMsg}`);
        results.errors.push(errorMsg);
      }
    }

    console.log('\n=== Seeding Summary ===');
    console.log(`Total: ${trainingsData.length}`);
    console.log(`Created: ${results.created}`);
    console.log(`Skipped: ${results.skipped}`);
    console.log(`Errors: ${results.errors.length}`);

    if (results.errors.length > 0) {
      console.log('\nErrors:');
      results.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    // Save trimmed data back to file (optional)
    console.log('\nSaving trimmed data back to file...');
    writeFileSync(filePath, JSON.stringify(trainingsData, null, 2), 'utf-8');
    console.log('✓ Trimmed data saved to file');

    process.exit(0);
  } catch (error: any) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run the function
trimAndSeedTrainings();

