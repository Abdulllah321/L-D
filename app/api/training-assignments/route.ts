/**
 * Training Assignments API
 * 
 * This API handles training assignments to designations with the following structure:
 * - Track Types: 'normal' | 'hi-po'
 * - Annual Types: null (Regular) | 'annual-regular' | 'annual-ecourse'
 * 
 * Assignment Types:
 * 1. Individual Training (trainingId)
 * 2. Learning Path (learningPathId)
 * 3. Custom Training Name (customTrainingName) - for trainings not in database
 * 
 * Endpoints:
 * - GET /api/training-assignments - Fetch assignments with optional filters
 * - POST /api/training-assignments - Create new assignment (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TrainingAssignment from '@/models/TrainingAssignment';
import Training from '@/models/Training';
import { getAuthFromRequest } from '@/lib/auth';

/**
 * GET /api/training-assignments
 * 
 * Query Parameters:
 * - designationId: Filter by designation ID
 * - trackType: Filter by track type ('normal' | 'hi-po')
 * - annualType: Filter by annual type ('annual-regular' | 'annual-ecourse' | 'null' for regular)
 * - subDesignationId: Filter by sub-designation ID
 * 
 * Returns: { trainings: TrainingAssignment[] }
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const designationId = searchParams.get('designationId');
    const trackType = searchParams.get('trackType');
    const annualType = searchParams.get('annualType');
    const subDesignationId = searchParams.get('subDesignationId');

    const query: any = {};
    if (designationId) {
      query.designationId = designationId.toUpperCase();
    }
    if (subDesignationId) {
      query.subDesignationId = subDesignationId.toUpperCase();
    } else if (designationId) {
      // For main designation, query where subDesignationId is null (MongoDB matches both null and non-existent fields)
      query.subDesignationId = null;
    }
    if (trackType) {
      query.trackType = trackType;
    }
    if (annualType !== null && annualType !== undefined) {
      if (annualType === 'null' || annualType === '') {
        // Query for regular tracks (annualType is null or doesn't exist)
        query.$or = [
          { annualType: { $exists: false } },
          { annualType: null }
        ];
      } else if (annualType === 'annual-regular' || annualType === 'annual-ecourse') {
        query.annualType = annualType;
      }
    }

    const assignments = await TrainingAssignment.find(query)
      .populate('trainingId')
      .populate({
        path: 'learningPathId',
        populate: {
          path: 'trainings.trainingId',
          model: 'Training'
        }
      })
      .sort({ designationId: 1, trackType: 1, annualType: 1, order: 1 });

    // Transform to include training data
    // For Learning Paths, we show them as a single item (not expanded)
    // For individual trainings, we show them normally
    // For custom training names (not in database), we show them with the custom name
    let trainings: any[] = [];
    
    for (const assignment of assignments) {
      if (assignment.customTrainingName) {
        // Custom training name assignment (not in database)
        trainings.push({
          _id: assignment._id.toString(), // Use assignment ID as _id
          assignmentId: assignment._id,
          programTitle: assignment.customTrainingName,
          order: assignment.order,
          designationId: assignment.designationId,
          subDesignationId: assignment.subDesignationId,
          trackType: assignment.trackType,
          annualType: assignment.annualType || null,
          isCustomTraining: true, // Flag to identify it's a custom training
        });
      } else if (assignment.trainingId) {
        // Individual training assignment
        const training = assignment.trainingId as any; // Populated Training
        trainings.push({
          _id: training._id,
          assignmentId: assignment._id,
          programTitle: training.programTitle,
          programObjective: training.programObjective,
          trainingPartner: training.trainingPartner,
          targetAudience: training.targetAudience,
          durationFormat: training.durationFormat,
          competencies: training.competencies,
          outcomesBenefits: training.outcomesBenefits,
          frequency: training.frequency,
          assessmentFollowUp: training.assessmentFollowUp,
          reviewDate: training.reviewDate,
          schedule: training.schedule,
          order: assignment.order,
          designationId: assignment.designationId,
          subDesignationId: assignment.subDesignationId,
          trackType: assignment.trackType,
          annualType: assignment.annualType || null,
        });
      } else if (assignment.learningPathId) {
        // Learning Path assignment - show as single item
        const lp = assignment.learningPathId as any; // Populated Learning Path
        trainings.push({
          _id: lp._id,
          assignmentId: assignment._id,
          learningPathId: lp._id,
          learningPathTitle: lp.title,
          programTitle: lp.title, // Use LP title as programTitle
          description: lp.description,
          trainingCount: lp.trainings?.length || 0,
          order: assignment.order,
          designationId: assignment.designationId,
          subDesignationId: assignment.subDesignationId,
          trackType: assignment.trackType,
          annualType: assignment.annualType || null,
          isLearningPath: true, // Flag to identify it's a Learning Path
        });
      }
    }

    return NextResponse.json({ trainings }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching training assignments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training assignments' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/training-assignments
 * 
 * Create a new training assignment (admin only)
 * 
 * Request Body:
 * {
 *   designationId: string (required)
 *   trackType: 'normal' | 'hi-po' (required)
 *   annualType?: 'annual-regular' | 'annual-ecourse' | null (optional, defaults to null)
 *   subDesignationId?: string (optional)
 *   trainingId?: string (optional - for individual training)
 *   learningPathId?: string (optional - for learning path)
 *   customTrainingName?: string (optional - for custom training name)
 *   order?: number (optional - auto-calculated if not provided)
 * }
 * 
 * Note: At least one of trainingId, learningPathId, or customTrainingName must be provided
 * 
 * Returns: { message: string, assignment: TrainingAssignment }
 */
export async function POST(request: NextRequest) {
  try {
    const auth = getAuthFromRequest(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const data = await request.json();
    const { trainingId, learningPathId, designationId, subDesignationId, trackType, annualType, order, customTrainingName } = data;

    // At least one of trainingId, learningPathId, or customTrainingName must be provided
    if ((!trainingId && !learningPathId && !customTrainingName) || !designationId || !trackType) {
      return NextResponse.json(
        { error: 'Either trainingId, learningPathId, or customTrainingName is required, along with designationId and trackType' },
        { status: 400 }
      );
    }
    
    // Validate trackType
    if (trackType !== 'normal' && trackType !== 'hi-po') {
      return NextResponse.json(
        { error: 'trackType must be either "normal" or "hi-po"' },
        { status: 400 }
      );
    }
    
    // Validate annualType if provided
    if (annualType !== null && annualType !== undefined && annualType !== 'annual-regular' && annualType !== 'annual-ecourse') {
      return NextResponse.json(
        { error: 'annualType must be either "annual-regular", "annual-ecourse", or null' },
        { status: 400 }
      );
    }

    // Validation: annual-ecourse ONLY accepts Learning Paths (not trainings)
    if (annualType === 'annual-ecourse') {
      if (trainingId || customTrainingName) {
        return NextResponse.json(
          { error: 'E-Course Learning Track only accepts Learning Paths, not individual trainings' },
          { status: 400 }
        );
      }
      if (!learningPathId) {
        return NextResponse.json(
          { error: 'Learning Path ID is required for E-Course Learning Track' },
          { status: 400 }
        );
      }
    }

    // Validation: Regular and Annual-Regular tracks only accept Trainings (not Learning Paths)
    if (annualType !== 'annual-ecourse' && learningPathId) {
      return NextResponse.json(
        { error: 'Learning Paths can only be assigned to E-Course Learning Track. Use Regular or Annual-Regular tracks for individual trainings.' },
        { status: 400 }
      );
    }

    // Check if training exists if provided
    if (trainingId) {
      const training = await Training.findById(trainingId);
      if (!training) {
        return NextResponse.json(
          { error: 'Training not found' },
          { status: 404 }
        );
      }
    }

    // Get the highest order for this designation+track+annualType to append at the end
    const orderQuery: any = {
        designationId: designationId.toUpperCase(),
        trackType
    };
    if (subDesignationId) {
        orderQuery.subDesignationId = subDesignationId.toUpperCase();
    } else {
        // For main designation, query where subDesignationId is null (MongoDB matches both null and non-existent fields)
        orderQuery.subDesignationId = null;
    }
    // Handle annualType - null means regular (non-annual) track
    if (annualType === null || annualType === undefined || annualType === '') {
      orderQuery.$or = [
        { annualType: { $exists: false } },
        { annualType: null }
      ];
    } else {
      orderQuery.annualType = annualType;
    }

    const maxOrderResult = await TrainingAssignment.findOne(orderQuery).sort({ order: -1 });

    const nextOrder = maxOrderResult ? maxOrderResult.order + 1 : (order !== undefined ? parseInt(order) : 0);

    const assignment = await TrainingAssignment.create({
      trainingId,
      learningPathId,
      designationId: designationId.toUpperCase(),
      subDesignationId: subDesignationId ? subDesignationId.toUpperCase() : undefined,
      trackType,
      annualType: annualType || null,
      order: nextOrder,
      customTrainingName: customTrainingName || undefined,
    });

    const populated = await TrainingAssignment.findById(assignment._id).populate('trainingId');

    return NextResponse.json(
      { message: 'Training assigned successfully', assignment: populated },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating training assignment:', error);
    
    return NextResponse.json(
      { error: 'Failed to create training assignment', details: error.message },
      { status: 500 }
    );
  }
}

