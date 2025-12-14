import { Client, Typing } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createInfoEmbed, formatUser, formatChannel } from '../../../utils';

export const event: EventHandler<'typingStart'> = {
  name: 'typingStart',
  async execute(client: Client<true>, typing: Typing) {
    if (!typing.guild) return;
    if (typing.user.bot) return;

    const logChannel = await getLogChannel(client, typing.guild.id, 'presence');
    if (!logChannel) return;

    const canLog = await shouldLog(typing.guild.id, 'presence', {
      userId: typing.user.id,
      channelId: typing.channel.id,
    });
    if (!canLog) return;

    const embed = createInfoEmbed('Typing Started')
      .addFields(
        { name: 'User', value: `${typing.user.tag} (${typing.user.id})`, inline: true },
        { name: 'Channel', value: formatChannel(typing.channel), inline: true }
      );

    await sendLog(logChannel, embed);
  },
};

export default event;
