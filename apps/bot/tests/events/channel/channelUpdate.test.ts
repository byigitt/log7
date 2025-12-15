import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/channel/channelUpdate';
import { createTestContext, disableCategory, expectLogSent, expectLogNotSent, TestContext, TEST_IDS } from '../../helpers/testUtils';
import { createMockGuildChannel } from '../../mocks/channel';

describe('channelUpdate', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('channel'); });

  it('sends log when channel updated', async () => {
    const old = createMockGuildChannel({ guildId: TEST_IDS.GUILD, name: 'old' });
    const updated = createMockGuildChannel({ guildId: TEST_IDS.GUILD, name: 'new' });
    await event.execute(ctx.client, old as any, updated as any);
    await expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('channel');
    const ch = createMockGuildChannel({ guildId: TEST_IDS.GUILD });
    await event.execute(ctx.client, ch as any, ch as any);
    await expectLogNotSent(ctx);
  });
});
