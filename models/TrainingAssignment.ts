import mongoose, { Schema, Document } from 'mongoose';

export interface ITrainingAssignment extends Document {
  trainingId: mongoose.Types.ObjectId;
  designationId: string;
  trackType: 'normal' | 'hi-po';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TrainingAssignmentSchema = new Schema<ITrainingAssignment>(
  {
    trainingId: {
      type: Schema.Types.ObjectId,
      ref: 'Training',
      required: true,
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
    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
TrainingAssignmentSchema.index({ designationId: 1, trackType: 1, order: 1 });
TrainingAssignmentSchema.index({ trainingId: 1 });
TrainingAssignmentSchema.index({ designationId: 1, trackType: 1 });

// Prevent duplicate assignments (same training can't be assigned twice to same designation+track)
TrainingAssignmentSchema.index({ trainingId: 1, designationId: 1, trackType: 1 }, { unique: true });

// Prevent model recompilation during development
if (mongoose.models.TrainingAssignment) {
  delete mongoose.models.TrainingAssignment;
}

const TrainingAssignment = mongoose.model<ITrainingAssignment>('TrainingAssignment', TrainingAssignmentSchema);

export default TrainingAssignment;

