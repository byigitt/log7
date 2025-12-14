import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/reaction/messageReactionAdd';
import { createTestContext, disableCategory, blacklistUser, expectLogSent, expectLogNotSent, TestContext, TEST_IDS } from '../../helpers/testUtils';
import { createMockMessage } from '../../mocks/message';
import { createMockUser } from '../../mocks/member';
import { MessageReaction } from 'discord.js';

const createReaction = (): MessageReaction => ({
  message: createMockMessage({ guildId: TEST_IDS.GUILD }),
  emoji: { name: '👍', id: null, toString: () => '👍' },
  count: 1, me: false,
} as unknown as MessageReaction);

describe('messageReactionAdd', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('reaction'); });

  it('sends log when reaction added', async () => {
    await event.execute(ctx.client, createReaction(), createMockUser({ id: TEST_IDS.USER }));
    expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('reaction');
    await event.execute(ctx.client, createReaction(), createMockUser({ id: TEST_IDS.USER }));
    expectLogNotSent(ctx);
  });

  it('skips when user blacklisted', async () => {
    await blacklistUser('reaction');
    await event.execute(ctx.client, createReaction(), createMockUser({ id: TEST_IDS.USER }));
    expectLogNotSent(ctx);
  });
});
