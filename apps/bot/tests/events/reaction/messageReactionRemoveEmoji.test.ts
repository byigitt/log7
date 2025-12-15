import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/reaction/messageReactionRemoveEmoji';
import { createTestContext, disableCategory, expectLogSent, expectLogNotSent, TestContext, TEST_IDS } from '../../helpers/testUtils';
import { createMockMessage } from '../../mocks/message';
import { MessageReaction } from 'discord.js';

const createReaction = (): MessageReaction => ({
  message: createMockMessage({ guildId: TEST_IDS.GUILD }),
  emoji: { name: '👍', id: null, toString: () => '👍' },
  count: 0, me: false,
} as unknown as MessageReaction);

describe('messageReactionRemoveEmoji', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('reaction'); });

  it('sends log when emoji reactions removed', async () => {
    await event.execute(ctx.client, createReaction());
    await expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('reaction');
    await event.execute(ctx.client, createReaction());
    await expectLogNotSent(ctx);
  });
});
