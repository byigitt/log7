import { describe, it, expect, beforeEach } from 'vitest';
import { GuildService, Guild } from '@log7/database';

describe('GuildService', () => {
  const guildId = '999999999999999999';
  const category = 'message' as const;
  const channelId = '111111111111111111';
  const userId = '222222222222222222';

  beforeEach(async () => {
    await Guild.deleteMany({});
  });

  describe('Category Config', () => {
    describe('setLogChannel', () => {
      it('should create new config', async () => {
        await GuildService.setLogChannel(guildId, category, channelId);
        const result = await GuildService.getLogChannelId(guildId, category);
        expect(result).toBe(channelId);
      });

      it('should update existing config', async () => {
        await GuildService.setLogChannel(guildId, category, channelId);
        const newChannelId = '222222222222222222';
        await GuildService.setLogChannel(guildId, category, newChannelId);
        const result = await GuildService.getLogChannelId(guildId, category);
        expect(result).toBe(newChannelId);
      });
    });

    describe('getLogChannelId', () => {
      it('should return null for non-existent guild', async () => {
        const result = await GuildService.getLogChannelId(guildId, category);
        expect(result).toBeNull();
      });

      it('should return channelId when enabled', async () => {
        await GuildService.setLogChannel(guildId, category, channelId);
        const result = await GuildService.getLogChannelId(guildId, category);
        expect(result).toBe(channelId);
      });
    });

    describe('disableCategory', () => {
      it('should set enabled to false', async () => {
        await GuildService.setLogChannel(guildId, category, channelId);
        await GuildService.disableCategory(guildId, category);
        const result = await GuildService.getLogChannelId(guildId, category);
        expect(result).toBeNull();
      });
    });

    describe('enableCategory', () => {
      it('should set enabled to true', async () => {
        await GuildService.setLogChannel(guildId, category, channelId);
        await GuildService.disableCategory(guildId, category);
        await GuildService.enableCategory(guildId, category);
        const result = await GuildService.getLogChannelId(guildId, category);
        expect(result).toBe(channelId);
      });
    });

    describe('getEnabledCategories', () => {
      it('should return empty array for new guild', async () => {
        const result = await GuildService.getEnabledCategories(guildId);
        expect(result).toHaveLength(0);
      });

      it('should return configured categories', async () => {
        await GuildService.setLogChannel(guildId, 'message', channelId);
        await GuildService.setLogChannel(guildId, 'member', channelId);
        const result = await GuildService.getEnabledCategories(guildId);
        expect(result).toHaveLength(2);
      });
    });

    describe('resetCategory', () => {
      it('should reset specific category config', async () => {
        await GuildService.setLogChannel(guildId, category, channelId);
        await GuildService.resetCategory(guildId, category);
        const result = await GuildService.getLogChannelId(guildId, category);
        expect(result).toBeNull();
      });

      it('should reset all configs for guild', async () => {
        await GuildService.setLogChannel(guildId, 'message', channelId);
        await GuildService.setLogChannel(guildId, 'member', channelId);
        await GuildService.resetCategory(guildId);
        const result = await GuildService.getEnabledCategories(guildId);
        expect(result).toHaveLength(0);
      });
    });
  });

  describe('Filters', () => {
    describe('addFilter', () => {
      it('should add whitelist entry', async () => {
        await GuildService.addFilter(guildId, 'whitelist', 'user', userId, 'all');
        const filters = await GuildService.listFilters(guildId, 'whitelist');
        expect(filters).toHaveLength(1);
        expect(filters[0].targetType).toBe('user');
        expect(filters[0].targetId).toBe(userId);
      });

      it('should add blacklist entry', async () => {
        await GuildService.addFilter(guildId, 'blacklist', 'channel', channelId, 'message');
        const filters = await GuildService.listFilters(guildId, 'blacklist');
        expect(filters).toHaveLength(1);
        expect(filters[0].targetType).toBe('channel');
        expect(filters[0].categories).toContain('message');
      });
    });

    describe('removeFilter', () => {
      it('should remove existing entry', async () => {
        await GuildService.addFilter(guildId, 'whitelist', 'user', userId, 'all');
        const removed = await GuildService.removeFilter(guildId, 'user', userId);
        expect(removed).toBe(true);
        const filters = await GuildService.listFilters(guildId, 'whitelist');
        expect(filters).toHaveLength(0);
      });

      it('should return false for non-existent entry', async () => {
        const removed = await GuildService.removeFilter(guildId, 'user', 'nonexistent');
        expect(removed).toBe(false);
      });
    });

    describe('listFilters', () => {
      it('should list all filters for guild', async () => {
        await GuildService.addFilter(guildId, 'whitelist', 'user', userId, 'all');
        await GuildService.addFilter(guildId, 'blacklist', 'channel', channelId, 'message');
        const filters = await GuildService.listFilters(guildId);
        expect(filters).toHaveLength(2);
      });

      it('should filter by type', async () => {
        await GuildService.addFilter(guildId, 'whitelist', 'user', userId, 'all');
        await GuildService.addFilter(guildId, 'blacklist', 'channel', channelId, 'message');
        const filters = await GuildService.listFilters(guildId, 'whitelist');
        expect(filters).toHaveLength(1);
        expect(filters[0].targetType).toBe('user');
      });
    });

    describe('shouldLog', () => {
      it('should return true when no filters exist', async () => {
        const result = await GuildService.shouldLog(guildId, 'message', { userId });
        expect(result).toBe(true);
      });

      it('should return false when user is blacklisted', async () => {
        await GuildService.addFilter(guildId, 'blacklist', 'user', userId, 'message');
        const result = await GuildService.shouldLog(guildId, 'message', { userId });
        expect(result).toBe(false);
      });

      it('should return false when channel is blacklisted', async () => {
        await GuildService.addFilter(guildId, 'blacklist', 'channel', channelId, 'message');
        const result = await GuildService.shouldLog(guildId, 'message', { channelId });
        expect(result).toBe(false);
      });

      it('should return true when user is whitelisted', async () => {
        await GuildService.addFilter(guildId, 'whitelist', 'user', userId, 'message');
        const result = await GuildService.shouldLog(guildId, 'message', { userId });
        expect(result).toBe(true);
      });

      it('should return false when whitelist exists but user not in it', async () => {
        await GuildService.addFilter(guildId, 'whitelist', 'user', 'other-user', 'message');
        const result = await GuildService.shouldLog(guildId, 'message', { userId });
        expect(result).toBe(false);
      });

      it('should check role filters', async () => {
        const roleId = '333333333333333333';
        await GuildService.addFilter(guildId, 'blacklist', 'role', roleId, 'message');
        const result = await GuildService.shouldLog(guildId, 'message', { roleIds: [roleId] });
        expect(result).toBe(false);
      });

      it('should apply "all" category filters', async () => {
        await GuildService.addFilter(guildId, 'blacklist', 'user', userId, 'all');
        const result = await GuildService.shouldLog(guildId, 'member', { userId });
        expect(result).toBe(false);
      });
    });
  });

  describe('Guild Lifecycle', () => {
    describe('getOrCreate', () => {
      it('should create guild if not exists', async () => {
        const guild = await GuildService.getOrCreate(guildId);
        expect(guild._id).toBe(guildId);
        expect(guild.filters.whitelist).toHaveLength(0);
        expect(guild.filters.blacklist).toHaveLength(0);
      });

      it('should return existing guild', async () => {
        await GuildService.setLogChannel(guildId, 'message', channelId);
        const guild = await GuildService.getOrCreate(guildId);
        expect(guild._id).toBe(guildId);
      });
    });

    describe('delete', () => {
      it('should delete guild', async () => {
        await GuildService.setLogChannel(guildId, 'message', channelId);
        await GuildService.delete(guildId);
        const result = await GuildService.getLogChannelId(guildId, 'message');
        expect(result).toBeNull();
      });
    });
  });
});
