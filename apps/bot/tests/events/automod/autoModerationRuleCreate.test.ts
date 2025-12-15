import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/automod/autoModerationRuleCreate';
import { createTestContext, disableCategory, expectLogSent, expectLogNotSent, createMockAutoModRule, TestContext } from '../../helpers/testUtils';

describe('autoModerationRuleCreate', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('automod'); });

  it('sends log when rule created', async () => {
    await event.execute(ctx.client, createMockAutoModRule());
    expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('automod');
    await event.execute(ctx.client, createMockAutoModRule());
    expectLogNotSent(ctx);
  });
});
