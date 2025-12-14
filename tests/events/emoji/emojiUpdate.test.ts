import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/emoji/emojiUpdate';
import { createTestContext, disableCategory, expectLogSent, expectLogNotSent, createMockEmoji, TestContext } from '../../helpers/testUtils';

describe('emojiUpdate', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('emoji'); });

  it('sends log when emoji updated', async () => {
    await event.execute(ctx.client, createMockEmoji({ name: 'old' }), createMockEmoji({ name: 'new' }));
    expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('emoji');
    await event.execute(ctx.client, createMockEmoji(), createMockEmoji());
    expectLogNotSent(ctx);
  });
});
