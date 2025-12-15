import { describe, it, expect } from 'vitest';
import { FilterService } from '../../../src/database/services';

describe('FilterService', () => {
  const guildId = '999999999999999999';
  const userId = '222222222222222222';
  const channelId = '111111111111111111';

  describe('add', () => {
    it('should add whitelist entry', async () => {
      const filter = await FilterService.add(guildId, 'whitelist', 'user', userId, 'all');
      expect(filter.filterType).toBe('whitelist');
      expect(filter.targetType).toBe('user');
      expect(filter.targetId).toBe(userId);
    });

    it('should add blacklist entry', async () => {
      const filter = await FilterService.add(guildId, 'blacklist', 'channel', channelId, 'message');
      expect(filter.filterType).toBe('blacklist');
      expect(filter.targetType).toBe('channel');
      expect(filter.eventCategory).toBe('message');
    });
  });

  describe('remove', () => {
    it('should remove existing entry', async () => {
      await FilterService.add(guildId, 'whitelist', 'user', userId, 'all');
      const removed = await FilterService.remove(guildId, 'user', userId, 'all');
      expect(removed).toBe(true);
    });

    it('should return false for non-existent entry', async () => {
      const removed = await FilterService.remove(guildId, 'user', 'nonexistent', 'all');
      expect(removed).toBe(false);
    });
  });

  describe('list', () => {
    it('should list all filters for guild', async () => {
      await FilterService.add(guildId, 'whitelist', 'user', userId, 'all');
      await FilterService.add(guildId, 'blacklist', 'channel', channelId, 'message');
      const filters = await FilterService.list(guildId);
      expect(filters).toHaveLength(2);
    });

    it('should filter by type', async () => {
      await FilterService.add(guildId, 'whitelist', 'user', userId, 'all');
      await FilterService.add(guildId, 'blacklist', 'channel', channelId, 'message');
      const filters = await FilterService.list(guildId, 'whitelist');
      expect(filters).toHaveLength(1);
      expect(filters[0].filterType).toBe('whitelist');
    });
  });

  describe('shouldLog', () => {
    it('should return true when no filters exist', async () => {
      const result = await FilterService.shouldLog(guildId, 'message', { userId });
      expect(result).toBe(true);
    });

    it('should return false when user is blacklisted', async () => {
      await FilterService.add(guildId, 'blacklist', 'user', userId, 'message');
      const result = await FilterService.shouldLog(guildId, 'message', { userId });
      expect(result).toBe(false);
    });

    it('should return false when channel is blacklisted', async () => {
      await FilterService.add(guildId, 'blacklist', 'channel', channelId, 'message');
      const result = await FilterService.shouldLog(guildId, 'message', { channelId });
      expect(result).toBe(false);
    });

    it('should return true when user is whitelisted', async () => {
      await FilterService.add(guildId, 'whitelist', 'user', userId, 'message');
      const result = await FilterService.shouldLog(guildId, 'message', { userId });
      expect(result).toBe(true);
    });

    it('should return false when whitelist exists but user not in it', async () => {
      await FilterService.add(guildId, 'whitelist', 'user', 'other-user', 'message');
      const result = await FilterService.shouldLog(guildId, 'message', { userId });
      expect(result).toBe(false);
    });

    it('should check role filters', async () => {
      const roleId = '333333333333333333';
      await FilterService.add(guildId, 'blacklist', 'role', roleId, 'message');
      const result = await FilterService.shouldLog(guildId, 'message', { roleIds: [roleId] });
      expect(result).toBe(false);
    });

    it('should apply "all" category filters', async () => {
      await FilterService.add(guildId, 'blacklist', 'user', userId, 'all');
      const result = await FilterService.shouldLog(guildId, 'member', { userId });
      expect(result).toBe(false);
    });
  });
});
