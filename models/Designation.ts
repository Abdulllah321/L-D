import mongoose, { Schema, Document } from 'mongoose';

export interface IDesignation extends Document {
  id: string;
  title: string;
  summary: string;
  iconName: string;
  coreTrainings: number;
  refreshers: number;
  createdAt: Date;
  updatedAt: Date;
}

const DesignationSchema = new Schema<IDesignation>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    iconName: {
      type: String,
      required: true,
      trim: true,
    },
    coreTrainings: {
      type: Number,
      required: true,
      min: 0,
    },
    refreshers: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation during development
const Designation =
  mongoose.models.Designation ||
  mongoose.model<IDesignation>('Designation', DesignationSchema);

export default Designation;

