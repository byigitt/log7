import { Client, TextChannel, EmbedBuilder, AttachmentBuilder, ChannelType } from 'discord.js';
import { EventCategory, FilterCheckParams } from '@log7/shared';
import { GuildService } from '@log7/database';
import { logQueue } from '../utils';

export async function getLogChannel(
  client: Client<true>,
  guildId: string,
  category: EventCategory
): Promise<TextChannel | null> {
  const channelId = await GuildService.getLogChannelId(guildId, category);
  if (!channelId) return null;

  try {
    const channel = await client.channels.fetch(channelId);
    if (channel && 'send' in channel && (channel.type === ChannelType.GuildText || channel.isTextBased())) {
      return channel as TextChannel;
    }
  } catch {
    return null;
  }

  return null;
}

export async function shouldLog(
  guildId: string,
  category: EventCategory,
  params: FilterCheckParams
): Promise<boolean> {
  return GuildService.shouldLog(guildId, category, params);
}

export interface SendLogOptions {
  guildId?: string;
  eventName?: string;
}

export function sendLog(
  channel: TextChannel,
  embed: EmbedBuilder,
  attachments?: AttachmentBuilder[],
  options?: SendLogOptions
): void {
  logQueue.add({
    channel,
    embed,
    attachments,
    guildId: options?.guildId,
    eventName: options?.eventName,
  });
}
