import mongoose, { Schema, Document } from 'mongoose';

export interface ITrainingAssignment extends Document {
  trainingId?: mongoose.Types.ObjectId;
  designationId: string;
  learningPathId?: mongoose.Types.ObjectId;
  subDesignationId?: string;
  trackType: 'normal' | 'hi-po'; // Main track type
  annualType?: 'annual-regular' | 'annual-ecourse' | null; // Annual training type (null for regular tracks)
  order: number;
  customTrainingName?: string; // For trainings not in our database
  createdAt: Date;
  updatedAt: Date;
}

const TrainingAssignmentSchema = new Schema<ITrainingAssignment>(
  {
    trainingId: {
      type: Schema.Types.ObjectId,
      ref: 'Training',
      required: false,
    },
    designationId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    trackType: {
      type: String,
      enum: ['normal', 'hi-po'],
      required: true,
    },
    annualType: {
      type: String,
      enum: ['annual-regular', 'annual-ecourse', null],
      default: null,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    learningPathId: {
      type: Schema.Types.ObjectId,
      ref: 'LearningPath',
    },
    subDesignationId: {
      type: String,
      trim: true,
      uppercase: true,
    },
    customTrainingName: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
TrainingAssignmentSchema.index({ designationId: 1, trackType: 1, annualType: 1, order: 1 });
TrainingAssignmentSchema.index({ trainingId: 1 });
TrainingAssignmentSchema.index({ designationId: 1, trackType: 1, annualType: 1 });

// Prevent model recompilation during development
if (mongoose.models.TrainingAssignment) {
  delete mongoose.models.TrainingAssignment;
}

const TrainingAssignment = mongoose.model<ITrainingAssignment>('TrainingAssignment', TrainingAssignmentSchema);

export default TrainingAssignment;

