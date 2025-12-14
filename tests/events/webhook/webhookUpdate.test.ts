import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/webhook/webhookUpdate';
import { createTestContext, disableCategory, blacklistChannel, expectLogSent, expectLogNotSent, TestContext, TEST_IDS } from '../../helpers/testUtils';
import { createMockTextChannel } from '../../mocks/channel';

describe('webhookUpdate', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('webhook'); });

  it('sends log when webhook updated', async () => {
    await event.execute(ctx.client, createMockTextChannel({ guildId: TEST_IDS.GUILD }) as any);
    expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('webhook');
    await event.execute(ctx.client, createMockTextChannel({ guildId: TEST_IDS.GUILD }) as any);
    expectLogNotSent(ctx);
  });

  it('skips when channel blacklisted', async () => {
    await blacklistChannel('webhook');
    await event.execute(ctx.client, createMockTextChannel({ id: TEST_IDS.CHANNEL, guildId: TEST_IDS.GUILD }) as any);
    expectLogNotSent(ctx);
  });
});
