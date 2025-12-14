import { describe, it, expect, beforeEach, vi } from 'vitest';
import { event } from '../../../src/events/handlers/ban/guildBanAdd';
import { GuildConfigService, FilterService } from '../../../src/database/services';
import { createMockClient, addMockChannel } from '../../mocks/client';
import { createMockTextChannel } from '../../mocks/channel';
import { createMockGuild } from '../../mocks/guild';
import { createMockUser } from '../../mocks/member';
import { GuildBan } from 'discord.js';

function createMockBan(options: { guildId?: string; userId?: string; reason?: string | null } = {}): GuildBan {
  const { guildId = '999999999999999999', userId = '222222222222222222', reason = null } = options;
  const guild = createMockGuild({ id: guildId });
  const user = createMockUser({ id: userId });

  return {
    guild,
    user,
    reason,
  } as unknown as GuildBan;
}

describe('guildBanAdd event', () => {
  const guildId = '999999999999999999';
  const logChannelId = '888888888888888888';

  beforeEach(async () => {
    await GuildConfigService.set(guildId, 'ban', logChannelId);
  });

  it('should send log when user is banned', async () => {
    const client = createMockClient();
    const logChannel = createMockTextChannel({ id: logChannelId, guildId });
    addMockChannel(client, logChannel);

    const ban = createMockBan({ guildId });

    await event.execute(client, ban);

    expect(logChannel.send).toHaveBeenCalled();
  });

  it('should not send log when category is disabled', async () => {
    await GuildConfigService.disable(guildId, 'ban');

    const client = createMockClient();
    const logChannel = createMockTextChannel({ id: logChannelId, guildId });
    addMockChannel(client, logChannel);

    const ban = createMockBan({ guildId });

    await event.execute(client, ban);

    expect(logChannel.send).not.toHaveBeenCalled();
  });

  it('should not send log when user is blacklisted', async () => {
    const userId = '222222222222222222';
    await FilterService.add(guildId, 'blacklist', 'user', userId, 'ban');

    const client = createMockClient();
    const logChannel = createMockTextChannel({ id: logChannelId, guildId });
    addMockChannel(client, logChannel);

    const ban = createMockBan({ guildId, userId });

    await event.execute(client, ban);

    expect(logChannel.send).not.toHaveBeenCalled();
  });
});
