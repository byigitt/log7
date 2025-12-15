import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/member/guildMemberUpdate';
import { createTestContext, disableCategory, blacklistUser, expectLogSent, expectLogNotSent, TestContext, TEST_IDS } from '../../helpers/testUtils';
import { createMockMember } from '../../mocks/member';

describe('guildMemberUpdate', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('member'); });

  it('sends log when member updated', async () => {
    const old = createMockMember({ guildId: TEST_IDS.GUILD, nickname: 'old' });
    const updated = createMockMember({ guildId: TEST_IDS.GUILD, nickname: 'new' });
    await event.execute(ctx.client, old, updated);
    expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('member');
    const m = createMockMember({ guildId: TEST_IDS.GUILD });
    await event.execute(ctx.client, m, m);
    expectLogNotSent(ctx);
  });

  it('skips when user blacklisted', async () => {
    await blacklistUser('member');
    const m = createMockMember({ id: TEST_IDS.USER, guildId: TEST_IDS.GUILD });
    await event.execute(ctx.client, m, m);
    expectLogNotSent(ctx);
  });
});
