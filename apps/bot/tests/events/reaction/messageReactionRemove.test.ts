import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/reaction/messageReactionRemove';
import { createTestContext, disableCategory, blacklistUser, expectLogSent, expectLogNotSent, TestContext, TEST_IDS } from '../../helpers/testUtils';
import { createMockMessage } from '../../mocks/message';
import { createMockUser } from '../../mocks/member';
import { MessageReaction } from 'discord.js';

const createReaction = (): MessageReaction => ({
  message: createMockMessage({ guildId: TEST_IDS.GUILD }),
  emoji: { name: '👍', id: null, toString: () => '👍' },
  count: 0, me: false,
} as unknown as MessageReaction);

describe('messageReactionRemove', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('reaction'); });

  it('sends log when reaction removed', async () => {
    await event.execute(ctx.client, createReaction(), createMockUser({ id: TEST_IDS.USER }));
    await expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('reaction');
    await event.execute(ctx.client, createReaction(), createMockUser({ id: TEST_IDS.USER }));
    await expectLogNotSent(ctx);
  });

  it('skips when user blacklisted', async () => {
    await blacklistUser('reaction');
    await event.execute(ctx.client, createReaction(), createMockUser({ id: TEST_IDS.USER }));
    await expectLogNotSent(ctx);
  });
});
