import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/sticker/stickerUpdate';
import { createTestContext, disableCategory, expectLogSent, expectLogNotSent, createMockSticker, TestContext } from '../../helpers/testUtils';

describe('stickerUpdate', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('sticker'); });

  it('sends log when sticker updated', async () => {
    await event.execute(ctx.client, createMockSticker({ name: 'old' }), createMockSticker({ name: 'new' }));
    expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('sticker');
    await event.execute(ctx.client, createMockSticker(), createMockSticker());
    expectLogNotSent(ctx);
  });
});
