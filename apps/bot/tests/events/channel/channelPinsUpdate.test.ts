import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/channel/channelPinsUpdate';
import { createTestContext, disableCategory, expectLogSent, expectLogNotSent, TestContext, TEST_IDS } from '../../helpers/testUtils';
import { createMockTextChannel } from '../../mocks/channel';

describe('channelPinsUpdate', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('channel'); });

  it('sends log when pins updated', async () => {
    await event.execute(ctx.client, createMockTextChannel({ guildId: TEST_IDS.GUILD }) as any, new Date());
    expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('channel');
    await event.execute(ctx.client, createMockTextChannel({ guildId: TEST_IDS.GUILD }) as any, new Date());
    expectLogNotSent(ctx);
  });
});
