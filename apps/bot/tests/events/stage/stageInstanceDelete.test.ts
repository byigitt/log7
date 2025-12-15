import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/stage/stageInstanceDelete';
import { createTestContext, disableCategory, expectLogSent, expectLogNotSent, createMockStageInstance, TestContext } from '../../helpers/testUtils';

describe('stageInstanceDelete', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('stage'); });

  it('sends log when stage deleted', async () => {
    await event.execute(ctx.client, createMockStageInstance());
    await expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('stage');
    await event.execute(ctx.client, createMockStageInstance());
    await expectLogNotSent(ctx);
  });
});
