
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnalyticsEvent extends Document {
  eventType: 'view' | 'click' | 'convert';
  path: string;
  target?: string; // For clicks, what element/name was clicked
  timestamp: Date;
  sessionId: string; // To track unique users roughly
  userAgent?: string;
  deviceType?: 'mobile' | 'desktop' | 'tablet';
  referrer?: string;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>({
  eventType: { type: String, required: true, enum: ['view', 'click', 'convert'] },
  path: { type: String, required: true },
  target: { type: String },
  timestamp: { type: Date, default: Date.now, index: true }, // Index for fast time-range queries
  sessionId: { type: String, required: true, index: true },
  userAgent: { type: String },
  deviceType: { type: String },
  referrer: { type: String }
});

// Create compound index for aggregating stats by time and type
AnalyticsEventSchema.index({ timestamp: -1, eventType: 1 });

const AnalyticsEvent: Model<IAnalyticsEvent> = mongoose.models.AnalyticsEvent || mongoose.model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventSchema);

export default AnalyticsEvent;
