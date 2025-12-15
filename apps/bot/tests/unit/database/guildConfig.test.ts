import { describe, it, expect, beforeEach } from 'vitest';
import { GuildConfigService } from '../../../src/database/services';

describe('GuildConfigService', () => {
  const guildId = '999999999999999999';
  const category = 'message' as const;
  const channelId = '111111111111111111';

  describe('set', () => {
    it('should create new config', async () => {
      const config = await GuildConfigService.set(guildId, category, channelId);
      expect(config.guildId).toBe(guildId);
      expect(config.eventCategory).toBe(category);
      expect(config.logChannelId).toBe(channelId);
      expect(config.enabled).toBe(true);
    });

    it('should update existing config', async () => {
      await GuildConfigService.set(guildId, category, channelId);
      const newChannelId = '222222222222222222';
      const config = await GuildConfigService.set(guildId, category, newChannelId);
      expect(config.logChannelId).toBe(newChannelId);
    });
  });

  describe('get', () => {
    it('should return null for non-existent config', async () => {
      const config = await GuildConfigService.get(guildId, category);
      expect(config).toBeNull();
    });

    it('should return config when exists', async () => {
      await GuildConfigService.set(guildId, category, channelId);
      const config = await GuildConfigService.get(guildId, category);
      expect(config).not.toBeNull();
      expect(config?.logChannelId).toBe(channelId);
    });
  });

  describe('disable', () => {
    it('should set enabled to false', async () => {
      await GuildConfigService.set(guildId, category, channelId);
      await GuildConfigService.disable(guildId, category);
      const config = await GuildConfigService.get(guildId, category);
      expect(config?.enabled).toBe(false);
    });
  });

  describe('enable', () => {
    it('should set enabled to true', async () => {
      await GuildConfigService.set(guildId, category, channelId);
      await GuildConfigService.disable(guildId, category);
      await GuildConfigService.enable(guildId, category);
      const config = await GuildConfigService.get(guildId, category);
      expect(config?.enabled).toBe(true);
    });
  });

  describe('getLogChannelId', () => {
    it('should return null when disabled', async () => {
      await GuildConfigService.set(guildId, category, channelId);
      await GuildConfigService.disable(guildId, category);
      const result = await GuildConfigService.getLogChannelId(guildId, category);
      expect(result).toBeNull();
    });

    it('should return channelId when enabled', async () => {
      await GuildConfigService.set(guildId, category, channelId);
      const result = await GuildConfigService.getLogChannelId(guildId, category);
      expect(result).toBe(channelId);
    });
  });

  describe('reset', () => {
    it('should delete specific category config', async () => {
      await GuildConfigService.set(guildId, category, channelId);
      await GuildConfigService.reset(guildId, category);
      const config = await GuildConfigService.get(guildId, category);
      expect(config).toBeNull();
    });

    it('should delete all configs for guild', async () => {
      await GuildConfigService.set(guildId, 'message', channelId);
      await GuildConfigService.set(guildId, 'member', channelId);
      await GuildConfigService.reset(guildId);
      const configs = await GuildConfigService.getAll(guildId);
      expect(configs).toHaveLength(0);
    });
  });
});
