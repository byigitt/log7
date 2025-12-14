import { GuildConfig } from '../models';
import { EventCategory, IGuildConfig } from '../../types';

export const GuildConfigService = {
  async get(guildId: string, category: EventCategory): Promise<IGuildConfig | null> {
    return GuildConfig.findOne({ guildId, eventCategory: category }).lean();
  },

  async set(guildId: string, category: EventCategory, channelId: string): Promise<IGuildConfig> {
    return GuildConfig.findOneAndUpdate(
      { guildId, eventCategory: category },
      { logChannelId: channelId, enabled: true },
      { upsert: true, new: true }
    ).lean() as Promise<IGuildConfig>;
  },

  async enable(guildId: string, category: EventCategory): Promise<IGuildConfig | null> {
    return GuildConfig.findOneAndUpdate(
      { guildId, eventCategory: category },
      { enabled: true },
      { new: true }
    ).lean();
  },

  async disable(guildId: string, category: EventCategory): Promise<IGuildConfig | null> {
    return GuildConfig.findOneAndUpdate(
      { guildId, eventCategory: category },
      { enabled: false },
      { new: true }
    ).lean();
  },

  async getAll(guildId: string): Promise<IGuildConfig[]> {
    return GuildConfig.find({ guildId }).lean();
  },

  async reset(guildId: string, category?: EventCategory): Promise<void> {
    if (category) {
      await GuildConfig.deleteOne({ guildId, eventCategory: category });
    } else {
      await GuildConfig.deleteMany({ guildId });
    }
  },

  async isEnabled(guildId: string, category: EventCategory): Promise<boolean> {
    const config = await GuildConfig.findOne({ guildId, eventCategory: category }).lean();
    return config?.enabled ?? false;
  },

  async getLogChannelId(guildId: string, category: EventCategory): Promise<string | null> {
    const config = await GuildConfig.findOne({ guildId, eventCategory: category }).lean();
    if (!config?.enabled) return null;
    return config.logChannelId;
  },
};
