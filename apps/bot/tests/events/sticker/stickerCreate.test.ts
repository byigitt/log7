import { describe, it, beforeEach } from 'vitest';
import { event } from '../../../src/events/handlers/sticker/stickerCreate';
import { createTestContext, disableCategory, expectLogSent, expectLogNotSent, createMockSticker, TestContext } from '../../helpers/testUtils';

describe('stickerCreate', () => {
  let ctx: TestContext;
  beforeEach(async () => { ctx = await createTestContext('sticker'); });

  it('sends log when sticker created', async () => {
    await event.execute(ctx.client, createMockSticker());
    await expectLogSent(ctx);
  });

  it('skips when disabled', async () => {
    await disableCategory('sticker');
    await event.execute(ctx.client, createMockSticker());
    await expectLogNotSent(ctx);
  });
});
