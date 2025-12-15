import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/voice/voiceStateUpdate';
import { createTestContext, disableCategory, blacklistUser, expectLogSent, expectLogNotSent, TestContext, TEST_IDS } from '../../helpers/testUtils';
import { createMockGuild } from '../../mocks/guild';
import { createMockMember } from '../../mocks/member';
import { VoiceState } from 'discord.js';

const createVoiceState = (channelId: string | null, opts: { odId?: string } = {}): VoiceState => ({
  guild: createMockGuild({ id: TEST_IDS.GUILD }),
  member: createMockMember({ id: opts.odId ?? TEST_IDS.USER, guildId: TEST_IDS.GUILD }),
  channelId,
  channel: channelId ? { id: channelId, name: 'VC', toString: () => `<#${channelId}>` } : null,
  selfMute: false, selfDeaf: false, serverMute: false, serverDeaf: false,
} as unknown as VoiceState);

describe('voiceStateUpdate', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('voice'); });

  it('sends log when user joins voice', async () => {
    await event.execute(ctx.client, createVoiceState(null), createVoiceState(TEST_IDS.CHANNEL));
    await expectLogSent(ctx);
  });

  it('sends log when user leaves voice', async () => {
    await event.execute(ctx.client, createVoiceState(TEST_IDS.CHANNEL), createVoiceState(null));
    await expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('voice');
    await event.execute(ctx.client, createVoiceState(null), createVoiceState(TEST_IDS.CHANNEL));
    await expectLogNotSent(ctx);
  });

  it('skips when user blacklisted', async () => {
    await blacklistUser('voice');
    await event.execute(ctx.client, createVoiceState(null, { odId: TEST_IDS.USER }), createVoiceState(TEST_IDS.CHANNEL, { odId: TEST_IDS.USER }));
    await expectLogNotSent(ctx);
  });
});
