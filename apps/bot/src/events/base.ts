import { Client, TextChannel, EmbedBuilder, AttachmentBuilder, ChannelType } from 'discord.js';
import { EventCategory, FilterCheckParams } from '@log7/shared';
import { GuildConfigService, FilterService } from '@log7/database';

export async function getLogChannel(
  client: Client<true>,
  guildId: string,
  category: EventCategory
): Promise<TextChannel | null> {
  const channelId = await GuildConfigService.getLogChannelId(guildId, category);
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
  return FilterService.shouldLog(guildId, category, params);
}

export async function sendLog(
  channel: TextChannel,
  embed: EmbedBuilder,
  attachments?: AttachmentBuilder[]
): Promise<void> {
  try {
    await channel.send({
      embeds: [embed],
      files: attachments,
    });
  } catch (error) {
    console.error('[Event] Failed to send log:', error);
  }
}
