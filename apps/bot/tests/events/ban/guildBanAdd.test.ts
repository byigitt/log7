import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/ban/guildBanAdd';
import { createTestContext, disableCategory, blacklistUser, expectLogSent, expectLogNotSent, createMockBan, TestContext, TEST_IDS } from '../../helpers/testUtils';

describe('guildBanAdd', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('ban'); });

  it('sends log when user banned', async () => {
    await event.execute(ctx.client, createMockBan());
    expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('ban');
    await event.execute(ctx.client, createMockBan());
    expectLogNotSent(ctx);
  });

  it('skips when user blacklisted', async () => {
    await blacklistUser('ban');
    await event.execute(ctx.client, createMockBan({ userId: TEST_IDS.USER }));
    expectLogNotSent(ctx);
  });
});
