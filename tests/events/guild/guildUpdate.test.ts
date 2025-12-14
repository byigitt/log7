import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/guild/guildUpdate';
import { createTestContext, disableCategory, expectLogSent, expectLogNotSent, TestContext, TEST_IDS } from '../../helpers/testUtils';
import { createMockGuild } from '../../mocks/guild';

describe('guildUpdate', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('guild'); });

  it('sends log when guild updated', async () => {
    await event.execute(ctx.client, createMockGuild({ id: TEST_IDS.GUILD, name: 'old' }), createMockGuild({ id: TEST_IDS.GUILD, name: 'new' }));
    expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('guild');
    const g = createMockGuild({ id: TEST_IDS.GUILD });
    await event.execute(ctx.client, g, g);
    expectLogNotSent(ctx);
  });
});
