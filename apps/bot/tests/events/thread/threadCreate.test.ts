import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/thread/threadCreate';
import { createTestContext, disableCategory, blacklistUser, expectLogSent, expectLogNotSent, createMockThread, TestContext, TEST_IDS } from '../../helpers/testUtils';

describe('threadCreate', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('thread'); });

  it('sends log when thread created (newlyCreated=true)', async () => {
    await event.execute(ctx.client, createMockThread(), true);
    expectLogSent(ctx);
  });

  it('skips when not newly created', async () => {
    await event.execute(ctx.client, createMockThread(), false);
    expectLogNotSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('thread');
    await event.execute(ctx.client, createMockThread(), true);
    expectLogNotSent(ctx);
  });
});
