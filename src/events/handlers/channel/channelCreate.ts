import { Client, NonThreadGuildBasedChannel } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createCreateEmbed, formatChannel, formatChannelType } from '../../../utils';

export const event: EventHandler<'channelCreate'> = {
  name: 'channelCreate',
  async execute(client: Client<true>, channel: NonThreadGuildBasedChannel) {
    const guild = channel.guild;

    const logChannel = await getLogChannel(client, guild.id, 'channel');
    if (!logChannel) return;

    const canLog = await shouldLog(guild.id, 'channel', {
      channelId: channel.id,
      categoryId: channel.parentId,
    });
    if (!canLog) return;

    const embed = createCreateEmbed('Channel Created')
      .addFields(
        { name: 'Channel', value: formatChannel(channel), inline: true },
        { name: 'Type', value: formatChannelType(channel.type), inline: true },
        { name: 'ID', value: channel.id, inline: true }
      );

    if (channel.parent) {
      embed.addFields({ name: 'Category', value: channel.parent.name, inline: true });
    }

    await sendLog(logChannel, embed);
  },
};

export default event;
