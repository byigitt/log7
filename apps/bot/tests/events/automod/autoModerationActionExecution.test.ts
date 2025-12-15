import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/automod/autoModerationActionExecution';
import { createTestContext, disableCategory, blacklistUser, expectLogSent, expectLogNotSent, TestContext, TEST_IDS } from '../../helpers/testUtils';
import { createMockGuild } from '../../mocks/guild';
import { AutoModerationActionExecution, AutoModerationRuleTriggerType, AutoModerationActionType } from 'discord.js';

const createExecution = (userId = TEST_IDS.USER): AutoModerationActionExecution => ({
  guild: createMockGuild({ id: TEST_IDS.GUILD }),
  guildId: TEST_IDS.GUILD,
  userId,
  channelId: TEST_IDS.CHANNEL,
  ruleId: TEST_IDS.AUTOMOD,
  ruleTriggerType: AutoModerationRuleTriggerType.Keyword,
  action: { type: AutoModerationActionType.BlockMessage },
  content: 'test', matchedKeyword: 'test', matchedContent: 'test',
} as unknown as AutoModerationActionExecution);

describe('autoModerationActionExecution', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('automod'); });

  it('sends log when action executed', async () => {
    await event.execute(ctx.client, createExecution());
    expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('automod');
    await event.execute(ctx.client, createExecution());
    expectLogNotSent(ctx);
  });

  it('skips when user blacklisted', async () => {
    await blacklistUser('automod');
    await event.execute(ctx.client, createExecution(TEST_IDS.USER));
    expectLogNotSent(ctx);
  });
});
