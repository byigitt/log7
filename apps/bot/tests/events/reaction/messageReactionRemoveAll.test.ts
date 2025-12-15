import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/reaction/messageReactionRemoveAll';
import { createTestContext, disableCategory, expectLogSent, expectLogNotSent, TestContext, TEST_IDS } from '../../helpers/testUtils';
import { createMockMessage } from '../../mocks/message';
import { Collection, MessageReaction } from 'discord.js';

describe('messageReactionRemoveAll', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('reaction'); });

  it('sends log when all reactions removed', async () => {
    await event.execute(ctx.client, createMockMessage({ guildId: TEST_IDS.GUILD }), new Collection<string, MessageReaction>());
    expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('reaction');
    await event.execute(ctx.client, createMockMessage({ guildId: TEST_IDS.GUILD }), new Collection<string, MessageReaction>());
    expectLogNotSent(ctx);
  });
});
