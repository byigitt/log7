import { Schema, model } from 'mongoose';
import { IErrorLog } from '@log7/shared';

const ErrorLogSchema = new Schema<IErrorLog>({
  timestamp: { type: Date, default: Date.now, index: true },
  level: { type: String, enum: ['error', 'warn', 'fatal'], required: true, index: true },
  type: { type: String, enum: ['event', 'command', 'database', 'system'], required: true, index: true },
  source: { type: String, required: true, index: true },
  message: { type: String, required: true },
  stack: { type: String },
  context: {
    guildId: { type: String, index: true },
    guildName: { type: String },
    userId: { type: String, index: true },
    userName: { type: String },
    channelId: { type: String },
    channelName: { type: String },
    extra: { type: Schema.Types.Mixed },
  },
  resolved: { type: Boolean, default: false, index: true },
  resolvedAt: { type: Date },
  resolvedBy: { type: String },
});

// TTL index - auto-delete resolved errors after 30 days
ErrorLogSchema.index({ resolvedAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60, partialFilterExpression: { resolved: true } });

// Compound index for common queries
ErrorLogSchema.index({ type: 1, timestamp: -1 });
ErrorLogSchema.index({ guildId: 1, timestamp: -1 });

export const ErrorLog = model<IErrorLog>('ErrorLog', ErrorLogSchema);
