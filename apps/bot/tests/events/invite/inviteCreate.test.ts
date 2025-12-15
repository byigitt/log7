import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/invite/inviteCreate';
import { createTestContext, disableCategory, expectLogSent, expectLogNotSent, createMockInvite, TestContext } from '../../helpers/testUtils';

describe('inviteCreate', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('invite'); });

  it('sends log when invite created', async () => {
    await event.execute(ctx.client, createMockInvite());
    await expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('invite');
    await event.execute(ctx.client, createMockInvite());
    await expectLogNotSent(ctx);
  });
});
