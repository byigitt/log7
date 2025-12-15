import { vi } from 'vitest';
import { Guild, Collection } from 'discord.js';

export interface MockGuildOptions {
  id?: string;
  name?: string;
  ownerId?: string;
}

export function createMockGuild(options: MockGuildOptions = {}): Guild {
  const {
    id = '999999999999999999',
    name = 'Test Guild',
    ownerId = '888888888888888888',
  } = options;

  return {
    id,
    name,
    ownerId,
    icon: null,
    banner: null,
    description: null,
    verificationLevel: 0,
    explicitContentFilter: 0,
    afkChannelId: null,
    afkChannel: null,
    afkTimeout: 300,
    systemChannelId: null,
    systemChannel: null,
    vanityURLCode: null,
    channels: {
      fetch: vi.fn(),
      cache: new Collection(),
    },
    members: {
      fetch: vi.fn(),
      cache: new Collection(),
    },
    roles: {
      cache: new Collection(),
    },
    iconURL: vi.fn().mockReturnValue(null),
  } as unknown as Guild;
}
