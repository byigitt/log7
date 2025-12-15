import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/channel/channelDelete';
import { createTestContext, disableCategory, expectLogSent, expectLogNotSent, TestContext, TEST_IDS } from '../../helpers/testUtils';
import { createMockGuildChannel } from '../../mocks/channel';

describe('channelDelete', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('channel'); });

  it('sends log when channel deleted', async () => {
    await event.execute(ctx.client, createMockGuildChannel({ guildId: TEST_IDS.GUILD }) as any);
    await expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('channel');
    await event.execute(ctx.client, createMockGuildChannel({ guildId: TEST_IDS.GUILD }) as any);
    await expectLogNotSent(ctx);
  });
});
