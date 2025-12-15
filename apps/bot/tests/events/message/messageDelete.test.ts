import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/message/messageDelete';
import { createTestContext, disableCategory, blacklistUser, blacklistChannel, expectLogSent, expectLogNotSent, TestContext, TEST_IDS } from '../../helpers/testUtils';
import { createMockMessage } from '../../mocks/message';

describe('messageDelete', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('message'); });

  it('sends log when message deleted', async () => {
    await event.execute(ctx.client, createMockMessage({ guildId: TEST_IDS.GUILD }));
    await expectLogSent(ctx);
  });

  it('skips bot messages', async () => {
    await event.execute(ctx.client, createMockMessage({ guildId: TEST_IDS.GUILD, bot: true }));
    await expectLogNotSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('message');
    await event.execute(ctx.client, createMockMessage({ guildId: TEST_IDS.GUILD }));
    await expectLogNotSent(ctx);
  });

  it('skips when user blacklisted', async () => {
    await blacklistUser('message');
    await event.execute(ctx.client, createMockMessage({ guildId: TEST_IDS.GUILD, authorId: TEST_IDS.USER }));
    await expectLogNotSent(ctx);
  });

  it('skips when channel blacklisted', async () => {
    await blacklistChannel('message');
    await event.execute(ctx.client, createMockMessage({ guildId: TEST_IDS.GUILD, channelId: TEST_IDS.CHANNEL }));
    await expectLogNotSent(ctx);
  });
});
