import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/scheduled/guildScheduledEventUpdate';
import { createTestContext, disableCategory, expectLogSent, expectLogNotSent, createMockScheduledEvent, TestContext } from '../../helpers/testUtils';

describe('guildScheduledEventUpdate', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('scheduled'); });

  it('sends log when event updated', async () => {
    await event.execute(ctx.client, createMockScheduledEvent({ name: 'old' }), createMockScheduledEvent({ name: 'new' }));
    await expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('scheduled');
    await event.execute(ctx.client, createMockScheduledEvent(), createMockScheduledEvent());
    await expectLogNotSent(ctx);
  });
});
