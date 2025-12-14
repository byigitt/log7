import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/scheduled/guildScheduledEventDelete';
import { createTestContext, disableCategory, expectLogSent, expectLogNotSent, createMockScheduledEvent, TestContext } from '../../helpers/testUtils';

describe('guildScheduledEventDelete', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('scheduled'); });

  it('sends log when event deleted', async () => {
    await event.execute(ctx.client, createMockScheduledEvent());
    expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('scheduled');
    await event.execute(ctx.client, createMockScheduledEvent());
    expectLogNotSent(ctx);
  });
});
