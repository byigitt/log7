import { Document } from 'mongoose';
import { EventCategory } from './events';

export interface IGuildConfig {
  guildId: string;
  eventCategory: EventCategory;
  logChannelId: string | null;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGuildConfigDocument extends IGuildConfig, Document {}

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
