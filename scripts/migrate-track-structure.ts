/**
 * Migration Script: Restructure Track Type
 * 
 * This script migrates the training assignments from the old structure to the new structure:
 * - Old: trackType: 'normal' | 'hi-po' | 'annual-regular' | 'annual-ecourse'
 * - New: trackType: 'normal' | 'hi-po', annualType: null | 'annual-regular' | 'annual-ecourse'
 * 
 * Migration rules:
 * - 'normal' → trackType: 'normal', annualType: null
 * - 'hi-po' → trackType: 'normal', annualType: null (will be converted to hi-po later)
 * - 'annual-regular' → trackType: 'normal', annualType: 'annual-regular'
 * - 'annual-ecourse' → trackType: 'normal', annualType: 'annual-ecourse'
 * 
 * Run this once to migrate the database.
 */

import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';

async function migrateTrackStructure() {
  try {
    await connectDB();
    
    const db = mongoose.connection.db;
    const collection = db.collection('trainingassignments');
    
    console.log('Starting migration...');
    
    // Get all documents
    const assignments = await collection.find({}).toArray();
    console.log(`Found ${assignments.length} training assignments to migrate`);
    
    let migrated = 0;
    let errors = 0;
    
    for (const assignment of assignments) {
      try {
        const update: any = {};
        
        // Migrate based on old trackType
        if (assignment.trackType === 'normal') {
          update.trackType = 'normal';
          update.annualType = null;
        } else if (assignment.trackType === 'hi-po') {
          // Transfer hi-po to normal for now (will be converted to hi-po later)
          update.trackType = 'normal';
          update.annualType = null;
        } else if (assignment.trackType === 'annual-regular') {
          update.trackType = 'normal';
          update.annualType = 'annual-regular';
        } else if (assignment.trackType === 'annual-ecourse') {
          update.trackType = 'normal';
          update.annualType = 'annual-ecourse';
        } else {
          console.log(`⚠️  Unknown trackType: ${assignment.trackType} for assignment ${assignment._id}`);
          errors++;
          continue;
        }
        
        await collection.updateOne(
          { _id: assignment._id },
          { $set: update }
        );
        
        migrated++;
        if (migrated % 100 === 0) {
          console.log(`Migrated ${migrated} assignments...`);
        }
      } catch (err: any) {
        console.error(`Error migrating assignment ${assignment._id}:`, err.message);
        errors++;
      }
    }
    
    console.log('\n✅ Migration completed!');
    console.log(`✓ Successfully migrated: ${migrated} assignments`);
    if (errors > 0) {
      console.log(`✗ Errors: ${errors} assignments`);
    }
    
    // Verify migration
    console.log('\n📊 Verifying migration...');
    const stats = await collection.aggregate([
      {
        $group: {
          _id: {
            trackType: '$trackType',
            annualType: '$annualType'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.trackType': 1, '_id.annualType': 1 } }
    ]).toArray();
    
    console.log('\nCurrent distribution:');
    stats.forEach(stat => {
      console.log(`  ${stat._id.trackType} / ${stat._id.annualType || 'null'}: ${stat.count} assignments`);
    });
    
  } catch (error: any) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run migration
migrateTrackStructure()
  .then(() => {
    console.log('\n🎉 Migration script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration script failed:', error);
    process.exit(1);
  });

