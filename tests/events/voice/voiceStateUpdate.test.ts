import { describe, it, expect, beforeEach, vi } from 'vitest';
import { event } from '../../../src/events/handlers/voice/voiceStateUpdate';
import { GuildConfigService, FilterService } from '../../../src/database/services';
import { createMockClient, addMockChannel } from '../../mocks/client';
import { createMockTextChannel } from '../../mocks/channel';
import { createMockGuild } from '../../mocks/guild';
import { createMockMember } from '../../mocks/member';
import { VoiceState, VoiceChannel } from 'discord.js';

function createMockVoiceState(options: {
  guildId?: string;
  memberId?: string;
  channelId?: string | null;
  selfMute?: boolean;
  selfDeaf?: boolean;
} = {}): VoiceState {
  const { 
    guildId = '999999999999999999', 
    memberId = '222222222222222222',
    channelId = '111111111111111111',
    selfMute = false,
    selfDeaf = false,
  } = options;

  const guild = createMockGuild({ id: guildId });
  const member = createMockMember({ id: memberId, guildId });

  return {
    guild,
    member,
    channelId,
    channel: channelId ? { id: channelId, name: 'Voice Channel', toString: () => `<#${channelId}>` } : null,
    selfMute,
    selfDeaf,
    serverMute: false,
    serverDeaf: false,
    streaming: false,
    selfVideo: false,
  } as unknown as VoiceState;
}

describe('voiceStateUpdate event', () => {
  const guildId = '999999999999999999';
  const logChannelId = '888888888888888888';

  beforeEach(async () => {
    await GuildConfigService.set(guildId, 'voice', logChannelId);
  });

  it('should send log when user joins voice channel', async () => {
    const client = createMockClient();
    const logChannel = createMockTextChannel({ id: logChannelId, guildId });
    addMockChannel(client, logChannel);

    const oldState = createMockVoiceState({ guildId, channelId: null });
    const newState = createMockVoiceState({ guildId, channelId: '111111111111111111' });

    await event.execute(client, oldState, newState);

    expect(logChannel.send).toHaveBeenCalled();
  });

  it('should send log when user leaves voice channel', async () => {
    const client = createMockClient();
    const logChannel = createMockTextChannel({ id: logChannelId, guildId });
    addMockChannel(client, logChannel);

    const oldState = createMockVoiceState({ guildId, channelId: '111111111111111111' });
    const newState = createMockVoiceState({ guildId, channelId: null });

    await event.execute(client, oldState, newState);

    expect(logChannel.send).toHaveBeenCalled();
  });

  it('should not send log when category is disabled', async () => {
    await GuildConfigService.disable(guildId, 'voice');

    const client = createMockClient();
    const logChannel = createMockTextChannel({ id: logChannelId, guildId });
    addMockChannel(client, logChannel);

    const oldState = createMockVoiceState({ guildId, channelId: null });
    const newState = createMockVoiceState({ guildId, channelId: '111111111111111111' });

    await event.execute(client, oldState, newState);

    expect(logChannel.send).not.toHaveBeenCalled();
  });

  it('should not send log when user is blacklisted', async () => {
    const userId = '222222222222222222';
    await FilterService.add(guildId, 'blacklist', 'user', userId, 'voice');

    const client = createMockClient();
    const logChannel = createMockTextChannel({ id: logChannelId, guildId });
    addMockChannel(client, logChannel);

    const oldState = createMockVoiceState({ guildId, memberId: userId, channelId: null });
    const newState = createMockVoiceState({ guildId, memberId: userId, channelId: '111111111111111111' });

    await event.execute(client, oldState, newState);

    expect(logChannel.send).not.toHaveBeenCalled();
  });
});
