import { describe, it, expect, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/channel/channelCreate';
import { GuildConfigService, FilterService } from '../../../src/database/services';
import { createMockClient, addMockChannel } from '../../mocks/client';
import { createMockTextChannel, createMockGuildChannel } from '../../mocks/channel';
import { ChannelType } from 'discord.js';

describe('channelCreate event', () => {
  const guildId = '999999999999999999';
  const logChannelId = '888888888888888888';

  beforeEach(async () => {
    await GuildConfigService.set(guildId, 'channel', logChannelId);
  });

  it('should send log when channel is created', async () => {
    const client = createMockClient();
    const logChannel = createMockTextChannel({ id: logChannelId, guildId });
    addMockChannel(client, logChannel);

    const newChannel = createMockGuildChannel({ 
      id: '111111111111111111', 
      name: 'new-channel',
      guildId,
      type: ChannelType.GuildText 
    });

    await event.execute(client, newChannel as any);

    expect(logChannel.send).toHaveBeenCalled();
  });

  it('should not send log when category is disabled', async () => {
    await GuildConfigService.disable(guildId, 'channel');

    const client = createMockClient();
    const logChannel = createMockTextChannel({ id: logChannelId, guildId });
    addMockChannel(client, logChannel);

    const newChannel = createMockGuildChannel({ guildId });

    await event.execute(client, newChannel as any);

    expect(logChannel.send).not.toHaveBeenCalled();
  });

  it('should not send log when channel is blacklisted', async () => {
    const channelId = '111111111111111111';
    await FilterService.add(guildId, 'blacklist', 'channel', channelId, 'channel');

    const client = createMockClient();
    const logChannel = createMockTextChannel({ id: logChannelId, guildId });
    addMockChannel(client, logChannel);

    const newChannel = createMockGuildChannel({ id: channelId, guildId });

    await event.execute(client, newChannel as any);

    expect(logChannel.send).not.toHaveBeenCalled();
  });
});
