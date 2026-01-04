/**
 * Migration Script: Drop Old Unique Index
 * 
 * This script drops the old unique index that's causing duplicate key errors
 * when assigning multiple Learning Paths to the same designation/track.
 * 
 * Run this once to fix the database.
 */

import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';

async function dropOldIndex() {
  try {
    await connectDB();
    
    const db = mongoose.connection.db;
    const collection = db.collection('trainingassignments');
    
    console.log('Checking existing indexes...');
    const indexes = await collection.indexes();
    console.log('Current indexes:', JSON.stringify(indexes, null, 2));
    
    // Drop the problematic old index
    const oldIndexName = 'trainingId_1_designationId_1_trackType_1_level_1';
    
    try {
      await collection.dropIndex(oldIndexName);
      console.log(`✅ Successfully dropped old index: ${oldIndexName}`);
    } catch (err: any) {
      if (err.code === 27 || err.message.includes('index not found')) {
        console.log(`ℹ️  Index ${oldIndexName} does not exist (already dropped or never existed)`);
      } else {
        throw err;
      }
    }
    
    // Also drop any other problematic indexes
    const problematicIndexes = [
      'trainingId_1_designationId_1_trackType_1',
      'trainingId_1_designationId_1_trackType_1_subDesignationId_1'
    ];
    
    for (const indexName of problematicIndexes) {
      try {
        await collection.dropIndex(indexName);
        console.log(`✅ Successfully dropped index: ${indexName}`);
      } catch (err: any) {
        if (err.code === 27 || err.message.includes('index not found')) {
          console.log(`ℹ️  Index ${indexName} does not exist`);
        } else {
          console.log(`⚠️  Could not drop ${indexName}:`, err.message);
        }
      }
    }
    
    console.log('\n📋 Final indexes:');
    const finalIndexes = await collection.indexes();
    console.log(JSON.stringify(finalIndexes, null, 2));
    
    console.log('\n✅ Migration complete! The new indexes from the model will be created automatically.');
    console.log('You can now assign multiple Learning Paths without duplicate key errors.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

dropOldIndex();
