import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/scheduled/guildScheduledEventCreate';
import { createTestContext, disableCategory, expectLogSent, expectLogNotSent, createMockScheduledEvent, TestContext } from '../../helpers/testUtils';

describe('guildScheduledEventCreate', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('scheduled'); });

  it('sends log when event created', async () => {
    await event.execute(ctx.client, createMockScheduledEvent());
    expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('scheduled');
    await event.execute(ctx.client, createMockScheduledEvent());
    expectLogNotSent(ctx);
  });
});
