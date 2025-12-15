import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/stage/stageInstanceUpdate';
import { createTestContext, disableCategory, expectLogSent, expectLogNotSent, createMockStageInstance, TestContext } from '../../helpers/testUtils';

describe('stageInstanceUpdate', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('stage'); });

  it('sends log when stage updated', async () => {
    await event.execute(ctx.client, createMockStageInstance({ topic: 'old' }), createMockStageInstance({ topic: 'new' }));
    await expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('stage');
    await event.execute(ctx.client, createMockStageInstance(), createMockStageInstance());
    await expectLogNotSent(ctx);
  });
});
