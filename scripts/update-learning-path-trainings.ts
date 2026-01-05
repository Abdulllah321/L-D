/**
 * MongoDB Query Script to Update Training courseOverview and frequency
 * within Learning Paths
 * 
 * This script updates trainings within learning paths by:
 * 1. Matching learning paths by title
 * 2. Matching trainings within those paths by title
 * 3. Updating courseOverview and frequency fields
 */

import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';
import LearningPath from '../models/LearningPath';

// Example usage function
async function updateLearningPathTrainings(
  learningPathTitle: string,
  trainingTitle: string,
  newCourseOverview: string,
  newFrequency: string
) {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // MongoDB update query using arrayFilters
    const result = await LearningPath.updateMany(
      // Match learning paths by title
      { title: learningPathTitle },
      // Update operation
      {
        $set: {
          'trainings.$[training].courseOverview': newCourseOverview,
          'trainings.$[training].frequency': newFrequency,
        }
      },
      // Array filters to match training by title
      {
        arrayFilters: [
          { 'training.title': trainingTitle }
        ]
      }
    );

    console.log(`Updated ${result.modifiedCount} learning path(s)`);
    console.log(`Matched ${result.matchedCount} learning path(s)`);
    
    return result;
  } catch (error) {
    console.error('Error updating learning path trainings:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Bulk update function for multiple trainings
async function bulkUpdateLearningPathTrainings(
  learningPathTitle: string,
  updates: Array<{
    trainingTitle: string;
    courseOverview: string;
    frequency: string;
  }>
) {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    let totalModified = 0;
    let totalMatched = 0;

    // Update each training one by one
    for (const update of updates) {
      const result = await LearningPath.updateMany(
        { title: learningPathTitle },
        {
          $set: {
            'trainings.$[training].courseOverview': update.courseOverview,
            'trainings.$[training].frequency': update.frequency,
          }
        },
        {
          arrayFilters: [
            { 'training.title': update.trainingTitle }
          ]
        }
      );

      totalModified += result.modifiedCount || 0;
      totalMatched += result.matchedCount || 0;
    }

    console.log(`Total updated: ${totalModified} learning path(s)`);
    console.log(`Total matched: ${totalMatched} learning path(s)`);
    
    return { modifiedCount: totalModified, matchedCount: totalMatched };
  } catch (error) {
    console.error('Error bulk updating learning path trainings:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Example: Update single training
// updateLearningPathTrainings(
//   'COM Regulatory Training Deck',
//   'Business Continuity Management (BCM)',
//   'This e-course is an updated, animated and engaging course...',
//   'Annually'
// );

// Example: Bulk update multiple trainings
// bulkUpdateLearningPathTrainings('COM Regulatory Training Deck', [
//   {
//     trainingTitle: 'Business Continuity Management (BCM)',
//     courseOverview: 'This e-course is an updated, animated and engaging course...',
//     frequency: 'Annually'
//   },
//   {
//     trainingTitle: 'Operations Risk Management',
//     courseOverview: 'This eCourse\'s key takeaways are: Demonstrate effectiveness of ORM awareness...',
//     frequency: 'Annually'
//   }
// ]);

export { updateLearningPathTrainings, bulkUpdateLearningPathTrainings };

