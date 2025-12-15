import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/automod/autoModerationRuleDelete';
import { createTestContext, disableCategory, expectLogSent, expectLogNotSent, createMockAutoModRule, TestContext } from '../../helpers/testUtils';

describe('autoModerationRuleDelete', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('automod'); });

  it('sends log when rule deleted', async () => {
    await event.execute(ctx.client, createMockAutoModRule());
    expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('automod');
    await event.execute(ctx.client, createMockAutoModRule());
    expectLogNotSent(ctx);
  });
});
