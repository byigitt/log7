import { Client, MessageReaction, PartialMessageReaction } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createDeleteEmbed, formatChannel } from '../../../utils';

export const event: EventHandler<'messageReactionRemoveEmoji'> = {
  name: 'messageReactionRemoveEmoji',
  async execute(client: Client<true>, reaction: MessageReaction | PartialMessageReaction) {
    if (!reaction.message.guild) return;

    const guild = reaction.message.guild;

    const logChannel = await getLogChannel(client, guild.id, 'reaction');
    if (!logChannel) return;

    const canLog = await shouldLog(guild.id, 'reaction', {
      channelId: reaction.message.channel.id,
    });
    if (!canLog) return;

    const emoji = reaction.emoji.id ? `<:${reaction.emoji.name}:${reaction.emoji.id}>` : reaction.emoji.name;

    const embed = createDeleteEmbed('Emoji Reactions Removed')
      .addFields(
        { name: 'Channel', value: formatChannel(reaction.message.channel), inline: true },
        { name: 'Emoji', value: emoji || 'Unknown', inline: true },
        { name: 'Message', value: `[Jump](${reaction.message.url})`, inline: true }
      );

    await sendLog(logChannel, embed);
  },
};

export default event;
