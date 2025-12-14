import { describe, it, expect, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/member/guildMemberAdd';
import { GuildConfigService, FilterService } from '../../../src/database/services';
import { createMockClient, addMockChannel } from '../../mocks/client';
import { createMockTextChannel } from '../../mocks/channel';
import { createMockMember } from '../../mocks/member';

describe('guildMemberAdd event', () => {
  const guildId = '999999999999999999';
  const logChannelId = '888888888888888888';

  beforeEach(async () => {
    await GuildConfigService.set(guildId, 'member', logChannelId);
  });

  it('should send log when member joins', async () => {
    const client = createMockClient();
    const logChannel = createMockTextChannel({ id: logChannelId, guildId });
    addMockChannel(client, logChannel);

    const member = createMockMember({ guildId });

    await event.execute(client, member);

    expect(logChannel.send).toHaveBeenCalled();
  });

  it('should not send log when category is disabled', async () => {
    await GuildConfigService.disable(guildId, 'member');

    const client = createMockClient();
    const logChannel = createMockTextChannel({ id: logChannelId, guildId });
    addMockChannel(client, logChannel);

    const member = createMockMember({ guildId });

    await event.execute(client, member);

    expect(logChannel.send).not.toHaveBeenCalled();
  });

  it('should not send log when user is blacklisted', async () => {
    const userId = '222222222222222222';
    await FilterService.add(guildId, 'blacklist', 'user', userId, 'member');

    const client = createMockClient();
    const logChannel = createMockTextChannel({ id: logChannelId, guildId });
    addMockChannel(client, logChannel);

    const member = createMockMember({ id: userId, guildId });

    await event.execute(client, member);

    expect(logChannel.send).not.toHaveBeenCalled();
  });

  it('should send log when user is whitelisted', async () => {
    const userId = '222222222222222222';
    await FilterService.add(guildId, 'whitelist', 'user', userId, 'member');

    const client = createMockClient();
    const logChannel = createMockTextChannel({ id: logChannelId, guildId });
    addMockChannel(client, logChannel);

    const member = createMockMember({ id: userId, guildId });

    await event.execute(client, member);

    expect(logChannel.send).toHaveBeenCalled();
  });
});
