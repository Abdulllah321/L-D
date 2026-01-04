import mongoose, { Schema, Document } from 'mongoose';

export interface IDesignation extends Document {
  id: string;
  title: string;
  iconName: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  subDesignations?: {
    id: string;
    title: string;
  }[];
}

const SubDesignationSchema = new Schema({
  id: { type: String, required: true, trim: true, uppercase: true },
  title: { type: String, required: true, trim: true }
}, { _id: false });

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
    order: {
      type: Number,
      required: false,
      default: 0,
    },
    subDesignations: {
      type: [SubDesignationSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient sorting
DesignationSchema.index({ order: 1 });

// Prevent model recompilation during development
const Designation =
  mongoose.models.Designation ||
  mongoose.model<IDesignation>('Designation', DesignationSchema);

export default Designation;

