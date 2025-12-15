import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/channel/channelCreate';
import { createTestContext, disableCategory, blacklistChannel, expectLogSent, expectLogNotSent, TestContext, TEST_IDS } from '../../helpers/testUtils';
import { createMockGuildChannel } from '../../mocks/channel';

describe('channelCreate', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('channel'); });

  it('sends log when channel created', async () => {
    await event.execute(ctx.client, createMockGuildChannel({ guildId: TEST_IDS.GUILD }) as any);
    await expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('channel');
    await event.execute(ctx.client, createMockGuildChannel({ guildId: TEST_IDS.GUILD }) as any);
    await expectLogNotSent(ctx);
  });

  it('skips when channel blacklisted', async () => {
    await blacklistChannel('channel');
    await event.execute(ctx.client, createMockGuildChannel({ id: TEST_IDS.CHANNEL, guildId: TEST_IDS.GUILD }) as any);
    await expectLogNotSent(ctx);
  });
});
