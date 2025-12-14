import { Client, GuildEmoji } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createDeleteEmbed } from '../../../utils';

export const event: EventHandler<'emojiDelete'> = {
  name: 'emojiDelete',
  async execute(client: Client<true>, emoji: GuildEmoji) {
    const logChannel = await getLogChannel(client, emoji.guild.id, 'emoji');
    if (!logChannel) return;

    const canLog = await shouldLog(emoji.guild.id, 'emoji', {});
    if (!canLog) return;

    const embed = createDeleteEmbed('Emoji Deleted')
      .setThumbnail(emoji.url)
      .addFields(
        { name: 'Emoji', value: `:${emoji.name}:`, inline: true },
        { name: 'ID', value: emoji.id, inline: true }
      );

    await sendLog(logChannel, embed);
  },
};

export default event;
