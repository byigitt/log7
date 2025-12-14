import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/thread/threadDelete';
import { createTestContext, disableCategory, expectLogSent, expectLogNotSent, createMockThread, TestContext } from '../../helpers/testUtils';

describe('threadDelete', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('thread'); });

  it('sends log when thread deleted', async () => {
    await event.execute(ctx.client, createMockThread());
    expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('thread');
    await event.execute(ctx.client, createMockThread());
    expectLogNotSent(ctx);
  });
});
