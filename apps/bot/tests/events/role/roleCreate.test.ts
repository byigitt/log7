import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/role/roleCreate';
import { createTestContext, disableCategory, expectLogSent, expectLogNotSent, createMockRole, TestContext } from '../../helpers/testUtils';

describe('roleCreate', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('role'); });

  it('sends log when role created', async () => {
    await event.execute(ctx.client, createMockRole());
    expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('role');
    await event.execute(ctx.client, createMockRole());
    expectLogNotSent(ctx);
  });
});
