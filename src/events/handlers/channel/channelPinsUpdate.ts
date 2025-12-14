import { Client, TextBasedChannel } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createInfoEmbed, formatChannel, formatTimestamp } from '../../../utils';

export const event: EventHandler<'channelPinsUpdate'> = {
  name: 'channelPinsUpdate',
  async execute(client: Client<true>, channel: TextBasedChannel, time: Date) {
    if (channel.isDMBased()) return;

    const guild = channel.guild;

    const logChannel = await getLogChannel(client, guild.id, 'channel');
    if (!logChannel) return;

    const canLog = await shouldLog(guild.id, 'channel', {
      channelId: channel.id,
      categoryId: 'parentId' in channel ? channel.parentId : null,
    });
    if (!canLog) return;

    const embed = createInfoEmbed('Channel Pins Updated')
      .addFields(
        { name: 'Channel', value: formatChannel(channel), inline: true },
        { name: 'Time', value: formatTimestamp(time), inline: true }
      );

    await sendLog(logChannel, embed);
  },
};

export default event;
