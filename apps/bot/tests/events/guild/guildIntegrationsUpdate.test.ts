import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/guild/guildIntegrationsUpdate';
import { createTestContext, disableCategory, expectLogSent, expectLogNotSent, TestContext, TEST_IDS } from '../../helpers/testUtils';
import { createMockGuild } from '../../mocks/guild';

describe('guildIntegrationsUpdate', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('guild'); });

  it('sends log when integrations updated', async () => {
    await event.execute(ctx.client, createMockGuild({ id: TEST_IDS.GUILD }));
    await expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('guild');
    await event.execute(ctx.client, createMockGuild({ id: TEST_IDS.GUILD }));
    await expectLogNotSent(ctx);
  });
});
