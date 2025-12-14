import { Client, GuildEmoji } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createCreateEmbed } from '../../../utils';

export const event: EventHandler<'emojiCreate'> = {
  name: 'emojiCreate',
  async execute(client: Client<true>, emoji: GuildEmoji) {
    const logChannel = await getLogChannel(client, emoji.guild.id, 'emoji');
    if (!logChannel) return;

    const canLog = await shouldLog(emoji.guild.id, 'emoji', {});
    if (!canLog) return;

    const embed = createCreateEmbed('Emoji Created')
      .setThumbnail(emoji.url)
      .addFields(
        { name: 'Emoji', value: `${emoji} \`:${emoji.name}:\``, inline: true },
        { name: 'ID', value: emoji.id, inline: true },
        { name: 'Animated', value: emoji.animated ? 'Yes' : 'No', inline: true }
      );

    await sendLog(logChannel, embed);
  },
};

export default event;
