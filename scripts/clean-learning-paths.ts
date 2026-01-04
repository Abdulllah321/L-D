import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Recursively clean and trim all string fields in an object
 * Removes escaped quotes, MongoDB fields, and trims strings
 */
function cleanStringFields(obj: any): any {
  if (typeof obj === 'string') {
    let cleaned = obj.trim();
    // Remove escaped quotes at the beginning and end (multiple patterns)
    cleaned = cleaned.replace(/^\\"+/, '').replace(/\\"+$/, '');
    cleaned = cleaned.replace(/^"+/, '').replace(/"+$/, '');
    // Remove any remaining escaped quotes in the middle
    cleaned = cleaned.replace(/\\"/g, '"');
    // Remove extra backslashes before newlines and tabs
    cleaned = cleaned.replace(/\\n/g, '\n');
    cleaned = cleaned.replace(/\\t/g, '\t');
    // Remove any remaining backslashes that are escaping quotes
    cleaned = cleaned.replace(/\\(.)/g, '$1');
    return cleaned;
  } else if (Array.isArray(obj)) {
    return obj.map(item => cleanStringFields(item));
  } else if (obj !== null && typeof obj === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip MongoDB-specific fields
      if (key === '_id' || key === '__v' || key === '$oid' || key === '$date') {
        continue;
      }
      // Skip nested MongoDB objects
      if (value && typeof value === 'object' && ('$oid' in value || '$date' in value)) {
        continue;
      }
      cleaned[key] = cleanStringFields(value);
    }
    return cleaned;
  }
  return obj;
}

async function cleanLearningPaths() {
  try {
    const filePath = resolve(process.cwd(), '../../test.learningpaths.json');
    
    console.log('Reading JSON file...');
    const fileContent = readFileSync(filePath, 'utf-8');
    let learningPathsData = JSON.parse(fileContent);

    console.log('Cleaning and trimming all fields...');
    learningPathsData = cleanStringFields(learningPathsData);

    // Remove MongoDB _id fields from root level and nested objects
    learningPathsData = learningPathsData.map((lp: any) => {
      const { _id, __v, createdAt, updatedAt, ...lpData } = lp;
      
      // Clean trainings array
      if (lpData.trainings && Array.isArray(lpData.trainings)) {
        lpData.trainings = lpData.trainings.map((training: any) => {
          const { _id, ...trainingData } = training;
          // Clean trainingId if it's a MongoDB object
          if (trainingData.trainingId && typeof trainingData.trainingId === 'object' && '$oid' in trainingData.trainingId) {
            trainingData.trainingId = trainingData.trainingId.$oid;
          }
          return trainingData;
        });
      }

      return lpData;
    });

    console.log('Writing cleaned JSON back to file...');
    writeFileSync(filePath, JSON.stringify(learningPathsData, null, 2), 'utf-8');

    console.log('✓ Learning paths JSON cleaned successfully!');
    console.log(`File saved to: ${filePath}`);
    console.log(`Total learning paths: ${learningPathsData.length}`);
  } catch (error: any) {
    console.error('Error:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
}

cleanLearningPaths();

