import { describe, it, expect, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/message/messageDelete';
import { GuildConfigService, FilterService } from '../../../src/database/services';
import { createMockClient, addMockChannel } from '../../mocks/client';
import { createMockTextChannel } from '../../mocks/channel';
import { createMockMessage } from '../../mocks/message';

describe('messageDelete event', () => {
  const guildId = '999999999999999999';
  const logChannelId = '888888888888888888';

  beforeEach(async () => {
    await GuildConfigService.set(guildId, 'message', logChannelId);
  });

  it('should send log when message is deleted', async () => {
    const client = createMockClient();
    const logChannel = createMockTextChannel({ id: logChannelId, guildId });
    addMockChannel(client, logChannel);

    const message = createMockMessage({ guildId, content: 'Test message' });

    await event.execute(client, message);

    expect(logChannel.send).toHaveBeenCalled();
  });

  it('should not send log for bot messages', async () => {
    const client = createMockClient();
    const logChannel = createMockTextChannel({ id: logChannelId, guildId });
    addMockChannel(client, logChannel);

    const message = createMockMessage({ guildId, bot: true });

    await event.execute(client, message);

    expect(logChannel.send).not.toHaveBeenCalled();
  });

  it('should not send log when category is disabled', async () => {
    await GuildConfigService.disable(guildId, 'message');

    const client = createMockClient();
    const logChannel = createMockTextChannel({ id: logChannelId, guildId });
    addMockChannel(client, logChannel);

    const message = createMockMessage({ guildId });

    await event.execute(client, message);

    expect(logChannel.send).not.toHaveBeenCalled();
  });

  it('should not send log when user is blacklisted', async () => {
    const userId = '222222222222222222';
    await FilterService.add(guildId, 'blacklist', 'user', userId, 'message');

    const client = createMockClient();
    const logChannel = createMockTextChannel({ id: logChannelId, guildId });
    addMockChannel(client, logChannel);

    const message = createMockMessage({ guildId, authorId: userId });

    await event.execute(client, message);

    expect(logChannel.send).not.toHaveBeenCalled();
  });

  it('should not send log when channel is blacklisted', async () => {
    const channelId = '111111111111111111';
    await FilterService.add(guildId, 'blacklist', 'channel', channelId, 'message');

    const client = createMockClient();
    const logChannel = createMockTextChannel({ id: logChannelId, guildId });
    addMockChannel(client, logChannel);

    const message = createMockMessage({ guildId, channelId });

    await event.execute(client, message);

    expect(logChannel.send).not.toHaveBeenCalled();
  });
});
