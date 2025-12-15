import { Guild } from '../models/Guild';
import {
  EventCategory,
  ICategoryConfig,
  IFilterEntry,
  IGuild,
  FilterCheckParams,
  ALL_EVENT_CATEGORIES,
} from '@log7/shared';

// Helper to create default categories
function createDefaultCategories(): Record<EventCategory, ICategoryConfig> {
  const categories = {} as Record<EventCategory, ICategoryConfig>;
  for (const cat of ALL_EVENT_CATEGORIES) {
    categories[cat] = { channelId: null, enabled: false };
  }
  return categories;
}

// Helper to get categories from document (handles Map)
function getCategories(doc: any): Record<EventCategory, ICategoryConfig> {
  if (!doc.categories) return createDefaultCategories();
  if (doc.categories instanceof Map) {
    return Object.fromEntries(doc.categories) as Record<EventCategory, ICategoryConfig>;
  }
  return doc.categories as Record<EventCategory, ICategoryConfig>;
}

export const GuildService = {
  // Get or create guild document
  async getOrCreate(guildId: string): Promise<IGuild> {
    let guild = await Guild.findById(guildId);
    if (!guild) {
      guild = await Guild.create({
        _id: guildId,
        categories: createDefaultCategories(),
        filters: { whitelist: [], blacklist: [] },
      });
    }
    const obj = guild.toObject();
    obj.categories = getCategories(obj);
    return obj as IGuild;
  },

  // Delete guild
  async delete(guildId: string): Promise<void> {
    await Guild.findByIdAndDelete(guildId);
  },

  // === Category Methods (formerly GuildConfigService) ===

  async getLogChannelId(guildId: string, category: EventCategory): Promise<string | null> {
    const guild = await Guild.findById(guildId);
    if (!guild) return null;
    
    const categories = getCategories(guild);
    const config = categories[category];
    if (!config?.enabled) return null;
    return config.channelId;
  },

  async setLogChannel(guildId: string, category: EventCategory, channelId: string): Promise<void> {
    await Guild.findByIdAndUpdate(
      guildId,
      {
        $set: {
          [`categories.${category}`]: { channelId, enabled: true },
        },
      },
      { upsert: true }
    );
  },

  async enableCategory(guildId: string, category: EventCategory): Promise<void> {
    await Guild.findByIdAndUpdate(
      guildId,
      { $set: { [`categories.${category}.enabled`]: true } },
      { upsert: true }
    );
  },

  async disableCategory(guildId: string, category: EventCategory): Promise<void> {
    await Guild.findByIdAndUpdate(
      guildId,
      { $set: { [`categories.${category}.enabled`]: false } },
      { upsert: true }
    );
  },

  async getAllCategories(guildId: string): Promise<Record<EventCategory, ICategoryConfig> | null> {
    const guild = await Guild.findById(guildId);
    if (!guild) return null;
    return getCategories(guild);
  },

  async getEnabledCategories(guildId: string): Promise<Array<{ category: EventCategory; config: ICategoryConfig }>> {
    const guild = await Guild.findById(guildId);
    if (!guild) return [];
    
    const categories = getCategories(guild);
    return Object.entries(categories)
      .filter(([_, config]) => config.enabled || config.channelId)
      .map(([category, config]) => ({ 
        category: category as EventCategory, 
        config 
      }));
  },

  async resetCategory(guildId: string, category?: EventCategory): Promise<void> {
    if (category) {
      await Guild.findByIdAndUpdate(guildId, {
        $set: { [`categories.${category}`]: { channelId: null, enabled: false } },
      });
    } else {
      await Guild.findByIdAndUpdate(guildId, {
        $set: { categories: createDefaultCategories() },
      });
    }
  },

  // === Filter Methods (formerly FilterService) ===

  async addFilter(
    guildId: string,
    filterType: 'whitelist' | 'blacklist',
    targetType: 'user' | 'role' | 'channel' | 'category',
    targetId: string,
    category: EventCategory | 'all' = 'all'
  ): Promise<void> {
    const guild = await this.getOrCreate(guildId);
    const filters = guild.filters[filterType];
    
    // Check if filter exists for this target
    const existingIndex = filters.findIndex(
      f => f.targetType === targetType && f.targetId === targetId
    );

    if (existingIndex >= 0) {
      // Add category if not already present
      if (!filters[existingIndex].categories.includes(category)) {
        await Guild.findByIdAndUpdate(guildId, {
          $addToSet: { [`filters.${filterType}.${existingIndex}.categories`]: category },
        });
      }
    } else {
      // Add new filter entry
      await Guild.findByIdAndUpdate(guildId, {
        $push: {
          [`filters.${filterType}`]: { targetType, targetId, categories: [category] },
        },
      });
    }
  },

  async removeFilter(
    guildId: string,
    targetType: 'user' | 'role' | 'channel' | 'category',
    targetId: string,
    category?: EventCategory | 'all'
  ): Promise<boolean> {
    const guild = await Guild.findById(guildId);
    if (!guild) return false;

    let modified = false;

    for (const filterType of ['whitelist', 'blacklist'] as const) {
      if (category) {
        // Remove specific category from filter
        const result = await Guild.findByIdAndUpdate(guildId, {
          $pull: {
            [`filters.${filterType}.$[elem].categories`]: category,
          },
        }, {
          arrayFilters: [{ 'elem.targetType': targetType, 'elem.targetId': targetId }],
        });
        if (result) modified = true;
      }

      // Remove filter entries with empty categories or remove entirely if no category specified
      await Guild.findByIdAndUpdate(guildId, {
        $pull: {
          [`filters.${filterType}`]: category 
            ? { targetType, targetId, categories: { $size: 0 } }
            : { targetType, targetId },
        },
      });
    }

    // Also try direct removal for simpler case
    const result = await Guild.findByIdAndUpdate(guildId, {
      $pull: {
        'filters.whitelist': { targetType, targetId },
        'filters.blacklist': { targetType, targetId },
      },
    });

    return modified || !!result;
  },

  async listFilters(
    guildId: string,
    filterType?: 'whitelist' | 'blacklist',
    category?: EventCategory | 'all'
  ): Promise<IFilterEntry[]> {
    const guild = await Guild.findById(guildId);
    if (!guild) return [];

    let filters: IFilterEntry[] = [];
    
    if (filterType) {
      filters = guild.filters[filterType] || [];
    } else {
      filters = [...(guild.filters.whitelist || []), ...(guild.filters.blacklist || [])];
    }

    if (category) {
      filters = filters.filter(f => 
        f.categories.includes(category) || f.categories.includes('all')
      );
    }

    return filters;
  },

  async clearFilters(guildId: string, filterType?: 'whitelist' | 'blacklist'): Promise<void> {
    if (filterType) {
      await Guild.findByIdAndUpdate(guildId, {
        $set: { [`filters.${filterType}`]: [] },
      });
    } else {
      await Guild.findByIdAndUpdate(guildId, {
        $set: { filters: { whitelist: [], blacklist: [] } },
      });
    }
  },

  async shouldLog(
    guildId: string,
    category: EventCategory,
    params: FilterCheckParams
  ): Promise<boolean> {
    const guild = await Guild.findById(guildId);
    if (!guild) return true;

    const whitelists = (guild.filters.whitelist || []).filter(f =>
      f.categories.includes(category) || f.categories.includes('all')
    );
    const blacklists = (guild.filters.blacklist || []).filter(f =>
      f.categories.includes(category) || f.categories.includes('all')
    );

    // If no filters, allow logging
    if (whitelists.length === 0 && blacklists.length === 0) return true;

    // If whitelist exists, target MUST be in whitelist
    if (whitelists.length > 0) {
      const inWhitelist = whitelists.some(f => matchesFilter(f, params));
      if (!inWhitelist) return false;
    }

    // If in blacklist, don't log
    if (blacklists.length > 0) {
      const inBlacklist = blacklists.some(f => matchesFilter(f, params));
      if (inBlacklist) return false;
    }

    return true;
  },
};

function matchesFilter(filter: IFilterEntry, params: FilterCheckParams): boolean {
  switch (filter.targetType) {
    case 'user':
      return params.userId === filter.targetId;
    case 'channel':
      return params.channelId === filter.targetId;
    case 'category':
      return params.categoryId === filter.targetId;
    case 'role':
      return params.roleIds?.includes(filter.targetId) ?? false;
    default:
      return false;
  }
}
