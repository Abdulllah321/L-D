/**
 * Script to update Regulatory Training Decks with courseOverview and frequency
 * Based on the provided data structure
 */

import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';
import LearningPath from '../models/LearningPath';

// Training data structure
interface TrainingUpdate {
  trainingTitle: string;
  courseOverview: string;
  frequency: string;
}

// Learning Path updates
const learningPathUpdates: Record<string, TrainingUpdate[]> = {
  'COM Regulatory Training Deck': [
    {
      trainingTitle: 'Business Continuity Management (BCM)',
      courseOverview: 'This e-course is an updated, animated and engaging learning content and has built-in case scenarios with respective knowledge checks. Due to its nature of being a SBP Regulatory training, it is mandatory for all the staff as it covers all important aspects of its objectives, major focal points, BCM Lifecycle and its Components, Crisis Management Planning and consequest communication.',
      frequency: 'Annually'
    },
    {
      trainingTitle: 'Operations Risk Management',
      courseOverview: `This eCourse's key takeaways are:
- Demonstrate effectiveness of ORM awareness culture at Bank-wide level.
- Enhance understanding of ORM tools and associated terminologies.
- Promote risk identification, management, monitoring and timely/ accurate reporting of operational issues/incidents
- Take appropriate actions/ root-cause analysis at HO/ ORM level, based on identification and timely reporting of the issues/ incidents.
- Reduction in operational losses by enhancing control environment (through process design improvements).`,
      frequency: 'Annually'
    },
    {
      trainingTitle: 'Compliance Essentials',
      courseOverview: 'This course consists of quiz that is mandatory for all new hires as it is one of the conditions for job confirmation.',
      frequency: 'For new hired'
    },
    {
      trainingTitle: 'AML/CFT Refresher',
      courseOverview: 'The e-course is updated with the current knowledge related to CAAML that includes interactive activities at multiple levels, and has in-built knowledge checks at regular intervals apart from a comprehsensive quiz.',
      frequency: 'Annually'
    },
    {
      trainingTitle: 'Cyber Security',
      courseOverview: `This eCourse covers the Cyber Security highlights:
- Network and Internet Access
- Computer Software License
- Cyber Security Incidents
- Cyber Attack
- Social Engineering & Safe Practices`,
      frequency: 'Annually'
    },
    {
      trainingTitle: 'CAF-FTC',
      courseOverview: 'This comprehensive e-course provides an in-depth exploration of essential financial conduct standards, including Consumer Protection, Banking Conduct, the Guiding Principles of Fair Treatment to Customers (FTC), and the Conduct Assessment Framework (CAF).',
      frequency: 'Annually'
    },
    {
      trainingTitle: 'Compliance Risk Management',
      courseOverview: 'This courses covers, compliance risk, potential areas prone to compliance risk, essentials of CRM, and mitigating compliance risk',
      frequency: 'Annually'
    },
    {
      trainingTitle: 'Banca Takaful',
      courseOverview: "This course covers faysal bank's banca products, such as health product, generla and life products, unit link products.",
      frequency: 'Tagging done for those staff who perform Bancatakaful'
    }
  ],
  'AOM Regulatory Training Deck': [
    {
      trainingTitle: 'Business Continuity Management (BCM)',
      courseOverview: 'This e-course is an updated, animated and engaging learning content and has built-in case scenarios with respective knowledge checks. Due to its nature of being a SBP Regulatory training, it is mandatory for all the staff as it covers all important aspects of its objectives, major focal points, BCM Lifecycle and its Components, Crisis Management Planning and consequest communication.',
      frequency: 'Annually'
    },
    {
      trainingTitle: 'Operations Risk Management',
      courseOverview: `This eCourse's key takeaways are:
- Demonstrate effectiveness of ORM awareness culture at Bank-wide level.
- Enhance understanding of ORM tools and associated terminologies.
- Promote risk identification, management, monitoring and timely/ accurate reporting of operational issues/incidents
- Take appropriate actions/ root-cause analysis at HO/ ORM level, based on identification and timely reporting of the issues/ incidents.
- Reduction in operational losses by enhancing control environment (through process design improvements).`,
      frequency: 'Annually'
    },
    {
      trainingTitle: 'Compliance Essentials',
      courseOverview: 'This course consists of quiz that is mandatory for all new hires as it is one of the conditions for job confirmation.',
      frequency: 'For new hired'
    },
    {
      trainingTitle: 'AML/CFT Refresher',
      courseOverview: 'The e-course is updated with the current knowledge related to CAAML that includes interactive activities at multiple levels, and has in-built knowledge checks at regular intervals apart from a comprehsensive quiz.',
      frequency: 'Annually'
    },
    {
      trainingTitle: 'Cyber Security',
      courseOverview: `This eCourse covers the Cyber Security highlights:
- Network and Internet Access
- Computer Software License
- Cyber Security Incidents
- Cyber Attack
- Social Engineering & Safe Practices`,
      frequency: 'Annually'
    },
    {
      trainingTitle: 'CAF-FTC',
      courseOverview: 'This comprehensive e-course provides an in-depth exploration of essential financial conduct standards, including Consumer Protection, Banking Conduct, the Guiding Principles of Fair Treatment to Customers (FTC), and the Conduct Assessment Framework (CAF).',
      frequency: 'Annually'
    },
    {
      trainingTitle: 'Basics of FX Regulations',
      courseOverview: `This course covers:
1. Understand the practical aspects of Foreign Exchange Regime
2. Gain Knowledge about Approved FCY Remittances
3. Know about the Private FCY Accounts other than Foreign Trade Transactions
4. Provide ready reference material for Branches and CPU staff`,
      frequency: 'Annually'
    },
    {
      trainingTitle: 'Compliance Risk Management',
      courseOverview: 'This courses covers, compliance risk, potential areas prone to compliance risk, essentials of CRM, and mitigating compliance risk',
      frequency: 'Annually'
    }
  ],
  'ROM Regulatory Training Deck': [
    {
      trainingTitle: 'Business Continuity Management (BCM)',
      courseOverview: 'This e-course is an updated, animated and engaging learning content and has built-in case scenarios with respective knowledge checks. Due to its nature of being a SBP Regulatory training, it is mandatory for all the staff as it covers all important aspects of its objectives, major focal points, BCM Lifecycle and its Components, Crisis Management Planning and consequest communication.',
      frequency: 'Annually'
    },
    {
      trainingTitle: 'Operations Risk Management',
      courseOverview: `This eCourse's key takeaways are:
- Demonstrate effectiveness of ORM awareness culture at Bank-wide level.
- Enhance understanding of ORM tools and associated terminologies.
- Promote risk identification, management, monitoring and timely/ accurate reporting of operational issues/incidents
- Take appropriate actions/ root-cause analysis at HO/ ORM level, based on identification and timely reporting of the issues/ incidents.
- Reduction in operational losses by enhancing control environment (through process design improvements).`,
      frequency: 'Annually'
    },
    {
      trainingTitle: 'Compliance Essentials',
      courseOverview: 'This course consists of quiz that is mandatory for all new hires as it is one of the conditions for job confirmation.',
      frequency: 'For new hired'
    },
    {
      trainingTitle: 'AML/CFT Refresher',
      courseOverview: 'The e-course is updated with the current knowledge related to CAAML that includes interactive activities at multiple levels, and has in-built knowledge checks at regular intervals apart from a comprehsensive quiz.',
      frequency: 'Annually'
    },
    {
      trainingTitle: 'Cyber Security',
      courseOverview: `This eCourse covers the Cyber Security highlights:
- Network and Internet Access
- Computer Software License
- Cyber Security Incidents
- Cyber Attack
- Social Engineering & Safe Practices`,
      frequency: 'Annually'
    },
    {
      trainingTitle: 'CAF-FTC',
      courseOverview: 'This comprehensive e-course provides an in-depth exploration of essential financial conduct standards, including Consumer Protection, Banking Conduct, the Guiding Principles of Fair Treatment to Customers (FTC), and the Conduct Assessment Framework (CAF).',
      frequency: 'Annually'
    },
    {
      trainingTitle: 'Basics of FX Regulations',
      courseOverview: `This course covers:
1. Understand the practical aspects of Foreign Exchange Regime
2. Gain Knowledge about Approved FCY Remittances
3. Know about the Private FCY Accounts other than Foreign Trade Transactions
4. Provide ready reference material for Branches and CPU staff`,
      frequency: 'Annually'
    },
    {
      trainingTitle: 'Compliance Risk Management',
      courseOverview: 'This courses covers, compliance risk, potential areas prone to compliance risk, essentials of CRM, and mitigating compliance risk',
      frequency: 'Annually'
    },
    {
      trainingTitle: 'ATM/FLM',
      courseOverview: 'Objective of this course is to guide ATM custodians to perform best practices on FBL ATMs to reduce ATM down time & prevent from ATM theft / skimming and cash deposit machine',
      frequency: 'Annually'
    }
  ]
};

async function updateAllRegulatoryTrainingDecks() {
  try {
    await connectDB();
    console.log('Connected to MongoDB\n');

    let totalUpdated = 0;
    let totalMatched = 0;

    // Process each learning path
    for (const [learningPathTitle, trainings] of Object.entries(learningPathUpdates)) {
      console.log(`\n📚 Processing: ${learningPathTitle}`);
      console.log(`   Found ${trainings.length} trainings to update\n`);

      // Update each training in the learning path
      for (const training of trainings) {
        const result = await LearningPath.updateMany(
          { title: learningPathTitle },
          {
            $set: {
              'trainings.$[training].courseOverview': training.courseOverview,
              'trainings.$[training].frequency': training.frequency,
            }
          },
          {
            arrayFilters: [
              { 'training.title': training.trainingTitle }
            ]
          }
        );

        if (result.modifiedCount > 0) {
          console.log(`   ✅ Updated: ${training.trainingTitle}`);
          console.log(`      Frequency: ${training.frequency}`);
        } else if (result.matchedCount > 0) {
          console.log(`   ⚠️  Matched but not modified: ${training.trainingTitle} (may already be up to date)`);
        } else {
          console.log(`   ❌ Not found: ${training.trainingTitle} in ${learningPathTitle}`);
        }

        totalMatched += result.matchedCount || 0;
        if (result.modifiedCount > 0) {
          totalUpdated += result.modifiedCount;
        }
      }
    }

    console.log(`\n\n📊 Summary:`);
    console.log(`   Total Learning Paths Matched: ${totalMatched}`);
    console.log(`   Total Learning Paths Updated: ${totalUpdated}`);
    console.log(`\n✅ Update process completed!`);

  } catch (error) {
    console.error('❌ Error updating learning paths:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the update
if (require.main === module) {
  updateAllRegulatoryTrainingDecks()
    .then(() => {
      console.log('\n✨ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Script failed:', error);
      process.exit(1);
    });
}

export { updateAllRegulatoryTrainingDecks };

