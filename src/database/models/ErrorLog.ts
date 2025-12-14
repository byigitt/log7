import { Schema, model, Document } from 'mongoose';

export type ErrorLevel = 'error' | 'warn' | 'fatal';
export type ErrorType = 'event' | 'command' | 'database' | 'system';

export interface IErrorContext {
  guildId?: string;
  guildName?: string;
  userId?: string;
  userName?: string;
  channelId?: string;
  channelName?: string;
  extra?: Record<string, unknown>;
}

export interface IErrorLog extends Document {
  timestamp: Date;
  level: ErrorLevel;
  type: ErrorType;
  source: string;
  message: string;
  stack?: string;
  context: IErrorContext;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

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
