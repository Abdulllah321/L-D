import mongoose, { Schema, Document } from 'mongoose';

export interface ITrainingDay extends Document {
  day: number;
  heading?: string; // Top-level heading (groups multiple main topics)
  mainTopic?: string; // Main topic/heading (e.g., "Basics of IB & Economic Model")
  topic: string; // Sub-topic or activity name
  time: string; // Time range (e.g., "09:00 - 09:30")
  duration?: string; // Optional separate duration field
  isBreak?: boolean;
  breakType?: 'lunch' | 'tea' | 'Other Activity';
  isQuiz?: boolean; // Quiz type item
  isCertificateDistribution?: boolean; // Certificate Distribution & Group Photo type
  presenters: {
    north?: string;
    centralI?: string;
    centralII?: string;
    south?: string;
  };
  notes?: string;
  order?: number; // Order within the day
}

export interface ITraining extends Document {
  programTitle: string;
  programObjective: string;
  trainingPartner: string;
  targetAudience: string;
  durationFormat: string;
  isHalfDay?: boolean; // Whether this is a half-day training
  isOnline?: boolean; // Whether this is an online training
  prerequisites?: string; // Prerequisites for the training
  competencies: {
    functional?: string[];
    core?: string[];
    leadership?: string[];
  };
  outcomesBenefits: string;
  frequency: string;
  assessmentFollowUp: string;
  reviewDate?: string;
  schedule: ITrainingDay[];
  createdAt: Date;
  updatedAt: Date;
}

const TrainingDaySchema = new Schema<ITrainingDay>({
  day: { type: Number, required: true },
  heading: { type: String, trim: true }, // Optional top-level heading grouping
  mainTopic: { type: String, trim: true }, // Optional main topic grouping
  topic: { type: String, required: true },
  time: { type: String, required: false }, // Made optional - validation handled in form
  duration: { type: String, trim: true }, // Optional separate duration
  isBreak: { type: Boolean, default: false },
  breakType: { type: String, enum: ['lunch', 'tea', 'Other Activity'] },
  isQuiz: { type: Boolean, default: false }, // Quiz type item
  isCertificateDistribution: { type: Boolean, default: false }, // Certificate Distribution & Group Photo type
  presenters: {
    north: { type: String },
    centralI: { type: String },
    centralII: { type: String },
    south: { type: String },
  },
  notes: { type: String },
  order: { type: Number, default: 0 },
}, { _id: false });

const TrainingSchema = new Schema<ITraining>(
  {
    programTitle: {
      type: String,
      required: true,
      trim: true,
    },
    programObjective: {
      type: String,
      required: true,
      trim: true,
    },
    trainingPartner: {
      type: String,
      required: true,
      trim: true,
    },
    targetAudience: {
      type: String,
      required: true,
      trim: true,
    },
    durationFormat: {
      type: String,
      required: true,
      trim: true,
    },
    isHalfDay: {
      type: Boolean,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    prerequisites: {
      type: String,
      trim: true,
    },
    competencies: {
      functional: [{ type: String }],
      core: [{ type: String }],
      leadership: [{ type: String }],
    },
    outcomesBenefits: {
      type: String,
      required: true,
      trim: true,
    },
    frequency: {
      type: String,
      required: true,
      trim: true,
    },
    assessmentFollowUp: {
      type: String,
      required: true,
      trim: true,
    },
    reviewDate: {
      type: String,
      trim: true,
    },
    schedule: [TrainingDaySchema],
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
TrainingSchema.index({ programTitle: 1 });

// Clear cached model to avoid schema conflicts
if (mongoose.models.Training) {
  delete mongoose.models.Training;
}

const Training = mongoose.model<ITraining>('Training', TrainingSchema);

export default Training;
