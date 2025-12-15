import { Filter } from '../models';
import { EventCategory, IFilter, FilterCheckParams } from '@log7/shared';

export const FilterService = {
  async add(
    guildId: string,
    filterType: 'whitelist' | 'blacklist',
    targetType: 'user' | 'role' | 'channel' | 'category',
    targetId: string,
    eventCategory: EventCategory | 'all' = 'all'
  ): Promise<IFilter> {
    return Filter.findOneAndUpdate(
      { guildId, targetType, targetId, eventCategory },
      { filterType },
      { upsert: true, new: true }
    ).lean() as Promise<IFilter>;
  },

  async remove(
    guildId: string,
    targetType: 'user' | 'role' | 'channel' | 'category',
    targetId: string,
    eventCategory: EventCategory | 'all' = 'all'
  ): Promise<boolean> {
    const result = await Filter.deleteOne({ guildId, targetType, targetId, eventCategory });
    return result.deletedCount > 0;
  },

  async list(
    guildId: string,
    filterType?: 'whitelist' | 'blacklist',
    eventCategory?: EventCategory | 'all'
  ): Promise<IFilter[]> {
    const query: Record<string, unknown> = { guildId };
    if (filterType) query.filterType = filterType;
    if (eventCategory) query.eventCategory = { $in: [eventCategory, 'all'] };
    return Filter.find(query).lean();
  },

  async clearAll(guildId: string, filterType?: 'whitelist' | 'blacklist'): Promise<void> {
    const query: Record<string, unknown> = { guildId };
    if (filterType) query.filterType = filterType;
    await Filter.deleteMany(query);
  },

  async shouldLog(
    guildId: string,
    category: EventCategory,
    params: FilterCheckParams
  ): Promise<boolean> {
    const filters = await Filter.find({
      guildId,
      eventCategory: { $in: [category, 'all'] },
    }).lean();

    if (filters.length === 0) return true;

    const whitelists = filters.filter((f) => f.filterType === 'whitelist');
    const blacklists = filters.filter((f) => f.filterType === 'blacklist');

    // If whitelist exists, target MUST be in whitelist
    if (whitelists.length > 0) {
      const inWhitelist = whitelists.some((w) => matchesFilter(w, params));
      if (!inWhitelist) return false;
    }

    // If in blacklist, don't log
    if (blacklists.length > 0) {
      const inBlacklist = blacklists.some((b) => matchesFilter(b, params));
      if (inBlacklist) return false;
    }

    return true;
  },
};

function matchesFilter(filter: IFilter, params: FilterCheckParams): boolean {
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
