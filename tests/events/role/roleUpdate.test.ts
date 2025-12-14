import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/role/roleUpdate';
import { createTestContext, disableCategory, expectLogSent, expectLogNotSent, createMockRole, TestContext } from '../../helpers/testUtils';

describe('roleUpdate', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('role'); });

  it('sends log when role updated', async () => {
    await event.execute(ctx.client, createMockRole({ name: 'old' }), createMockRole({ name: 'new' }));
    expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('role');
    await event.execute(ctx.client, createMockRole(), createMockRole());
    expectLogNotSent(ctx);
  });
});
