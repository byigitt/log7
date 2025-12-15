import { Schema, model } from 'mongoose';
import { IGuildDocument, ALL_EVENT_CATEGORIES, ICategoryConfig, IFilterEntry } from '@log7/shared';

const CategoryConfigSchema = new Schema<ICategoryConfig>(
  {
    channelId: { type: String, default: null },
    enabled: { type: Boolean, default: false },
  },
  { _id: false }
);

const FilterEntrySchema = new Schema<IFilterEntry>(
  {
    targetType: { type: String, enum: ['user', 'role', 'channel', 'category'], required: true },
    targetId: { type: String, required: true },
    categories: { type: [String], default: ['all'] },
  },
  { _id: false }
);

// Create default categories object
function createDefaultCategories(): Record<string, ICategoryConfig> {
  const categories: Record<string, ICategoryConfig> = {};
  for (const cat of ALL_EVENT_CATEGORIES) {
    categories[cat] = { channelId: null, enabled: false };
  }
  return categories;
}

const GuildSchema = new Schema<IGuildDocument>(
  {
    _id: { type: String, required: true }, // Discord guild ID
    categories: {
      type: Map,
      of: CategoryConfigSchema,
      default: createDefaultCategories,
    },
    filters: {
      whitelist: { type: [FilterEntrySchema], default: [] },
      blacklist: { type: [FilterEntrySchema], default: [] },
    },
  },
  { 
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        // Convert Map to plain object for JSON
        if (ret.categories instanceof Map) {
          ret.categories = Object.fromEntries(ret.categories);
        }
        return ret;
      },
    },
    toObject: {
      transform: (_, ret) => {
        if (ret.categories instanceof Map) {
          ret.categories = Object.fromEntries(ret.categories);
        }
        return ret;
      },
    },
  }
);

export const Guild = model<IGuildDocument>('Guild', GuildSchema);
