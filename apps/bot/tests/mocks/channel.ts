import { vi } from 'vitest';
import { TextChannel, ChannelType, Guild, Collection } from 'discord.js';

export interface MockChannelOptions {
  id?: string;
  name?: string;
  guildId?: string;
  parentId?: string | null;
  type?: ChannelType;
}

export function createMockTextChannel(options: MockChannelOptions = {}): TextChannel {
  const {
    id = '111111111111111111',
    name = 'test-channel',
    guildId = '999999999999999999',
    parentId = null,
    type = ChannelType.GuildText,
  } = options;

  const mockGuild = {
    id: guildId,
    name: 'Test Guild',
  } as Guild;

  return {
    id,
    name,
    type,
    guildId,
    parentId,
    guild: mockGuild,
    parent: parentId ? { id: parentId, name: 'Test Category' } : null,
    send: vi.fn().mockResolvedValue({ id: 'sent-message-id' }),
    isTextBased: () => true,
    isDMBased: () => false,
    toString: () => `<#${id}>`,
  } as unknown as TextChannel;
}

export function createMockGuildChannel(options: MockChannelOptions = {}) {
  return {
    ...createMockTextChannel(options),
    type: options.type ?? ChannelType.GuildText,
  };
}
