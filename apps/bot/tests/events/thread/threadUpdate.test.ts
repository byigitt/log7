import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/thread/threadUpdate';
import { createTestContext, disableCategory, expectLogSent, expectLogNotSent, createMockThread, TestContext } from '../../helpers/testUtils';

describe('threadUpdate', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('thread'); });

  it('sends log when thread updated', async () => {
    await event.execute(ctx.client, createMockThread({ name: 'old' }), createMockThread({ name: 'new' }));
    await expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('thread');
    await event.execute(ctx.client, createMockThread(), createMockThread());
    await expectLogNotSent(ctx);
  });
});
