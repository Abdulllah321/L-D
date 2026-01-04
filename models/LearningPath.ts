import mongoose, { Schema, Document } from 'mongoose';

export interface ILearningPath extends Document {
  title: string;
  description?: string;
  frequency?: string; // Top-level frequency
  deckId?: mongoose.Types.ObjectId; // Reference to parent deck
  categoryId?: string; // Category ID within the deck
  trainings: {
    trainingId?: mongoose.Types.ObjectId; // Optional for custom items
    title?: string; // For custom items or snapshot
    isPlaceholder?: boolean; // Flag for custom items
    courseOverview?: string;
    frequency?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const LearningPathSchema = new Schema<ILearningPath>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    frequency: {
      type: String,
      required: false,
      trim: true,
    },
    deckId: {
      type: Schema.Types.ObjectId,
      ref: 'LearningDeck',
      required: false,
    },
    categoryId: {
      type: String,
      required: false,
    },
    trainings: [{
      trainingId: { type: Schema.Types.ObjectId, ref: 'Training', required: false },
      title: { type: String, trim: true },
      isPlaceholder: { type: Boolean, default: false },
      courseOverview: { type: String, trim: true },
      frequency: { type: String, trim: true }
    }],
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation during development, but handle HMR
if (mongoose.models.LearningPath) {
  delete mongoose.models.LearningPath;
}

const LearningPath = mongoose.model<ILearningPath>('LearningPath', LearningPathSchema);

export default LearningPath;
