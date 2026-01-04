import mongoose, { Schema, Document } from 'mongoose';

export interface ILearningDeck extends Document {
  title: string;
  description?: string;
  categories: {
    id: string;
    title: string;
    description?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const LearningDeckSchema = new Schema<ILearningDeck>(
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
    categories: [{
      id: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        required: false,
        trim: true,
      }
    }],
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation during development
if (mongoose.models.LearningDeck) {
  delete mongoose.models.LearningDeck;
}

const LearningDeck = mongoose.model<ILearningDeck>('LearningDeck', LearningDeckSchema);

export default LearningDeck;
