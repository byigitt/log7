import { describe, it, expect, beforeEach, vi } from 'vitest';
import { event } from '../../../src/events/handlers/role/roleCreate';
import { GuildConfigService } from '../../../src/database/services';
import { createMockClient, addMockChannel } from '../../mocks/client';
import { createMockTextChannel } from '../../mocks/channel';
import { createMockGuild } from '../../mocks/guild';
import { Role } from 'discord.js';

function createMockRole(options: { id?: string; name?: string; guildId?: string; color?: number } = {}): Role {
  const { id = '444444444444444444', name = 'Test Role', guildId = '999999999999999999', color = 0xff0000 } = options;
  const guild = createMockGuild({ id: guildId });
  
  return {
    id,
    name,
    guild,
    color,
    hexColor: `#${color.toString(16).padStart(6, '0')}`,
    hoist: false,
    mentionable: false,
    position: 1,
    permissions: { bitfield: BigInt(0) },
    toString: () => `<@&${id}>`,
  } as unknown as Role;
}

describe('roleCreate event', () => {
  const guildId = '999999999999999999';
  const logChannelId = '888888888888888888';

  beforeEach(async () => {
    await GuildConfigService.set(guildId, 'role', logChannelId);
  });

  it('should send log when role is created', async () => {
    const client = createMockClient();
    const logChannel = createMockTextChannel({ id: logChannelId, guildId });
    addMockChannel(client, logChannel);

    const role = createMockRole({ guildId });

    await event.execute(client, role);

    expect(logChannel.send).toHaveBeenCalled();
  });

  it('should not send log when category is disabled', async () => {
    await GuildConfigService.disable(guildId, 'role');

    const client = createMockClient();
    const logChannel = createMockTextChannel({ id: logChannelId, guildId });
    addMockChannel(client, logChannel);

    const role = createMockRole({ guildId });

    await event.execute(client, role);

    expect(logChannel.send).not.toHaveBeenCalled();
  });
});
