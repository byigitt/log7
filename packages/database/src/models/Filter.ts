import { Schema, model } from 'mongoose';
import { IFilterDocument } from '@log7/shared';

const FilterSchema = new Schema<IFilterDocument>(
  {
    guildId: { type: String, required: true, index: true },
    filterType: { type: String, enum: ['whitelist', 'blacklist'], required: true },
    targetType: { type: String, enum: ['user', 'role', 'channel', 'category'], required: true },
    targetId: { type: String, required: true },
    eventCategory: { type: String, default: 'all' },
  },
  { timestamps: true }
);

FilterSchema.index({ guildId: 1, filterType: 1, eventCategory: 1 });
FilterSchema.index({ guildId: 1, targetType: 1, targetId: 1, eventCategory: 1 }, { unique: true });

export const Filter = model<IFilterDocument>('Filter', FilterSchema);
