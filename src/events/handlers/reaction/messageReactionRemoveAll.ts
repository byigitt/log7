import { Client, Message, PartialMessage } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createDeleteEmbed, formatChannel } from '../../../utils';

export const event: EventHandler<'messageReactionRemoveAll'> = {
  name: 'messageReactionRemoveAll',
  async execute(client: Client<true>, message: Message | PartialMessage) {
    if (!message.guild) return;

    const guild = message.guild;

    const logChannel = await getLogChannel(client, guild.id, 'reaction');
    if (!logChannel) return;

    const canLog = await shouldLog(guild.id, 'reaction', {
      channelId: message.channel.id,
    });
    if (!canLog) return;

    const embed = createDeleteEmbed('All Reactions Removed')
      .addFields(
        { name: 'Channel', value: formatChannel(message.channel), inline: true },
        { name: 'Message', value: `[Jump](${message.url})`, inline: true }
      );

    await sendLog(logChannel, embed);
  },
};

export default event;
