import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/message/messageUpdate';
import { createTestContext, disableCategory, blacklistUser, expectLogSent, expectLogNotSent, TestContext, TEST_IDS } from '../../helpers/testUtils';
import { createMockMessage } from '../../mocks/message';

describe('messageUpdate', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('message'); });

  it('sends log when message updated', async () => {
    const old = createMockMessage({ guildId: TEST_IDS.GUILD, content: 'old' });
    const updated = createMockMessage({ guildId: TEST_IDS.GUILD, content: 'new' });
    await event.execute(ctx.client, old, updated);
    expectLogSent(ctx);
  });

  it('skips bot messages', async () => {
    const m = createMockMessage({ guildId: TEST_IDS.GUILD, bot: true });
    await event.execute(ctx.client, m, m);
    expectLogNotSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('message');
    const m = createMockMessage({ guildId: TEST_IDS.GUILD });
    await event.execute(ctx.client, m, m);
    expectLogNotSent(ctx);
  });

  it('skips when user blacklisted', async () => {
    await blacklistUser('message');
    const m = createMockMessage({ guildId: TEST_IDS.GUILD, authorId: TEST_IDS.USER });
    await event.execute(ctx.client, m, m);
    expectLogNotSent(ctx);
  });
});
