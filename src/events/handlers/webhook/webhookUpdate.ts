import { Client, TextChannel, NewsChannel, VoiceChannel, ForumChannel, MediaChannel } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createInfoEmbed, formatChannel } from '../../../utils';

type WebhookUpdateChannel = TextChannel | NewsChannel | VoiceChannel | ForumChannel | MediaChannel;

export const event: EventHandler<'webhookUpdate'> = {
  name: 'webhookUpdate',
  async execute(client: Client<true>, channel: WebhookUpdateChannel) {
    if (!channel.guild) return;

    const logChannel = await getLogChannel(client, channel.guild.id, 'webhook');
    if (!logChannel) return;

    const canLog = await shouldLog(channel.guild.id, 'webhook', {
      channelId: channel.id,
      categoryId: channel.parentId,
    });
    if (!canLog) return;

    const embed = createInfoEmbed('Webhook Updated')
      .setDescription('A webhook was created, deleted, or updated in this channel.')
      .addFields({ name: 'Channel', value: formatChannel(channel), inline: true });

    await sendLog(logChannel, embed);
  },
};

export default event;
