import { vi } from 'vitest';
import { Client, Collection, TextChannel, Channel } from 'discord.js';

const channelStore = new Map<string, TextChannel>();

export function createMockClient(overrides: Partial<Client> = {}): Client<true> {
  const mockChannelCache = new Collection<string, Channel>();
  
  const client = {
    channels: {
      fetch: vi.fn().mockImplementation(async (id: string) => {
        return channelStore.get(id) || mockChannelCache.get(id) || null;
      }),
      cache: mockChannelCache,
    },
    guilds: {
      cache: new Collection(),
    },
    user: {
      id: '123456789',
      tag: 'TestBot#0001',
    },
    ...overrides,
  } as unknown as Client<true>;

  return client;
}

export function addMockChannel(client: Client<true>, channel: TextChannel): void {
  channelStore.set(channel.id, channel);
  (client.channels.cache as Collection<string, Channel>).set(channel.id, channel);
}

export function clearMockChannels(): void {
  channelStore.clear();
}
