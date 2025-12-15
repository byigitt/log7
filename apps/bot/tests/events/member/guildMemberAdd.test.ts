import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/member/guildMemberAdd';
import { createTestContext, disableCategory, blacklistUser, expectLogSent, expectLogNotSent, TestContext, TEST_IDS } from '../../helpers/testUtils';
import { createMockMember } from '../../mocks/member';

describe('guildMemberAdd', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('member'); });

  it('sends log when member joins', async () => {
    await event.execute(ctx.client, createMockMember({ guildId: TEST_IDS.GUILD }));
    expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('member');
    await event.execute(ctx.client, createMockMember({ guildId: TEST_IDS.GUILD }));
    expectLogNotSent(ctx);
  });

  it('skips when user blacklisted', async () => {
    await blacklistUser('member');
    await event.execute(ctx.client, createMockMember({ id: TEST_IDS.USER, guildId: TEST_IDS.GUILD }));
    expectLogNotSent(ctx);
  });
});
