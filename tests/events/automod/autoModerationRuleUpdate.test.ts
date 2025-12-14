import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/automod/autoModerationRuleUpdate';
import { createTestContext, disableCategory, expectLogSent, expectLogNotSent, createMockAutoModRule, TestContext } from '../../helpers/testUtils';

describe('autoModerationRuleUpdate', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('automod'); });

  it('sends log when rule updated', async () => {
    await event.execute(ctx.client, createMockAutoModRule({ name: 'old' }), createMockAutoModRule({ name: 'new' }));
    expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('automod');
    await event.execute(ctx.client, createMockAutoModRule(), createMockAutoModRule());
    expectLogNotSent(ctx);
  });
});
