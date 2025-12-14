import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/emoji/emojiDelete';
import { createTestContext, disableCategory, expectLogSent, expectLogNotSent, createMockEmoji, TestContext } from '../../helpers/testUtils';

describe('emojiDelete', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('emoji'); });

  it('sends log when emoji deleted', async () => {
    await event.execute(ctx.client, createMockEmoji());
    expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('emoji');
    await event.execute(ctx.client, createMockEmoji());
    expectLogNotSent(ctx);
  });
});
