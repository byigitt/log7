import { Document } from 'mongoose';

// Event Categories
export type EventCategory =
  | 'channel'
  | 'guild'
  | 'member'
  | 'message'
  | 'reaction'
  | 'role'
  | 'voice'
  | 'thread'
  | 'emoji'
  | 'sticker'
  | 'invite'
  | 'scheduled'
  | 'stage'
  | 'ban'
  | 'automod'
  | 'interaction'
  | 'presence'
  | 'user'
  | 'webhook';

export const ALL_EVENT_CATEGORIES: EventCategory[] = [
  'channel', 'guild', 'member', 'message', 'reaction', 'role', 'voice',
  'thread', 'emoji', 'sticker', 'invite', 'scheduled', 'stage', 'ban',
  'automod', 'interaction', 'presence', 'user', 'webhook'
];

// Category Config (embedded in Guild)
export interface ICategoryConfig {
  channelId: string | null;
  enabled: boolean;
}

// Filter Entry (embedded in Guild)
export interface IFilterEntry {
  targetType: 'user' | 'role' | 'channel' | 'category';
  targetId: string;
  categories: Array<EventCategory | 'all'>;
}

// Guild Document (single document per Discord guild)
export interface IGuild {
  _id: string; // Discord guild ID
  categories: Record<EventCategory, ICategoryConfig>;
  filters: {
    whitelist: IFilterEntry[];
    blacklist: IFilterEntry[];
  };
  createdAt: Date;
  updatedAt: Date;
}

// For Mongoose - use string _id
export type IGuildDocument = IGuild & Document;

// Filter check params (used by shouldLog)
export interface FilterCheckParams {
  userId?: string;
  channelId?: string;
  categoryId?: string | null;
  roleIds?: string[];
}

// Error Log
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
