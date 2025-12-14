import { vi } from 'vitest';
import { Client, TextChannel, EmbedBuilder } from 'discord.js';
import { GuildConfigService } from '../../src/database/services';
import { EventCategory } from '../../src/types';
import { createMockClient, addMockChannel } from '../mocks/client';
import { createMockTextChannel } from '../mocks/channel';

export interface TestContext {
  client: Client<true>;
  logChannel: TextChannel;
  guildId: string;
  logChannelId: string;
}

export async function setupTestContext(category: EventCategory): Promise<TestContext> {
  const guildId = '999999999999999999';
  const logChannelId = '888888888888888888';

  const client = createMockClient();
  const logChannel = createMockTextChannel({ id: logChannelId, guildId });

  addMockChannel(client, logChannel);

  await GuildConfigService.set(guildId, category, logChannelId);

  return { client, logChannel, guildId, logChannelId };
}

export function expectLogSent(logChannel: TextChannel): void {
  expect(logChannel.send).toHaveBeenCalled();
}

export function expectLogNotSent(logChannel: TextChannel): void {
  expect(logChannel.send).not.toHaveBeenCalled();
}

export function expectEmbedWithTitle(logChannel: TextChannel, title: string): void {
  expect(logChannel.send).toHaveBeenCalledWith(
    expect.objectContaining({
      embeds: expect.arrayContaining([
        expect.objectContaining({
          data: expect.objectContaining({
            title,
          }),
        }),
      ]),
    })
  );
}

export function getLastSentEmbed(logChannel: TextChannel): EmbedBuilder | undefined {
  const calls = (logChannel.send as ReturnType<typeof vi.fn>).mock.calls;
  if (calls.length === 0) return undefined;
  const lastCall = calls[calls.length - 1][0];
  return lastCall?.embeds?.[0];
}
