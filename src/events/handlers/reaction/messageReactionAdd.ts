import { Client, MessageReaction, PartialMessageReaction, User, PartialUser } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createInfoEmbed, formatUser } from '../../../utils';

export const event: EventHandler<'messageReactionAdd'> = {
  name: 'messageReactionAdd',
  async execute(client: Client<true>, reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) {
    if (!reaction.message.guild) return;
    if (user.bot) return;

    const guild = reaction.message.guild;

    const logChannel = await getLogChannel(client, guild.id, 'reaction');
    if (!logChannel) return;

    const canLog = await shouldLog(guild.id, 'reaction', {
      userId: user.id,
      channelId: reaction.message.channel.id,
    });
    if (!canLog) return;

    const emoji = reaction.emoji.id ? `<:${reaction.emoji.name}:${reaction.emoji.id}>` : reaction.emoji.name;

    const embed = createInfoEmbed('Reaction Added')
      .addFields(
        { name: 'User', value: formatUser(user as User), inline: true },
        { name: 'Emoji', value: emoji || 'Unknown', inline: true },
        { name: 'Message', value: `[Jump](${reaction.message.url})`, inline: true }
      );

    await sendLog(logChannel, embed);
  },
};

export default event;
