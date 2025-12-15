import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/message/messageDeleteBulk';
import { createTestContext, disableCategory, expectLogSent, expectLogNotSent, TestContext, TEST_IDS } from '../../helpers/testUtils';
import { createMockMessage } from '../../mocks/message';
import { createMockTextChannel } from '../../mocks/channel';
import { Collection, Message, Snowflake } from 'discord.js';

describe('messageDeleteBulk', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('message'); });

  it('sends log when messages bulk deleted', async () => {
    const msgs = new Collection<Snowflake, Message>();
    msgs.set('1', createMockMessage({ id: '1', guildId: TEST_IDS.GUILD }));
    msgs.set('2', createMockMessage({ id: '2', guildId: TEST_IDS.GUILD }));
    await event.execute(ctx.client, msgs, createMockTextChannel({ guildId: TEST_IDS.GUILD }) as any);
    expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('message');
    const msgs = new Collection<Snowflake, Message>();
    msgs.set('1', createMockMessage({ guildId: TEST_IDS.GUILD }));
    await event.execute(ctx.client, msgs, createMockTextChannel({ guildId: TEST_IDS.GUILD }) as any);
    expectLogNotSent(ctx);
  });
});
