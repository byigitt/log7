import { Document } from 'mongoose';

export interface Guild {
  id: string;
  name: string;
}

export interface Channel {
  id: string;
  name: string;
  guildId: string;
}

export interface LogEntry {
  id: string;
  type: string;
  guildId: string;
  channelId?: string;
  userId?: string;
  timestamp: Date;
  data: Record<string, unknown>;
}

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

// Guild Config
export interface IGuildConfig {
  guildId: string;
  eventCategory: EventCategory;
  logChannelId: string | null;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGuildConfigDocument extends IGuildConfig, Document {}

// Filter
export interface IFilter {
  guildId: string;
  filterType: 'whitelist' | 'blacklist';
  targetType: 'user' | 'role' | 'channel' | 'category';
  targetId: string;
  eventCategory: EventCategory | 'all';
  createdAt: Date;
  updatedAt: Date;
}

export interface IFilterDocument extends IFilter, Document {}

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
