import { Client, GuildEmoji } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createUpdateEmbed } from '../../../utils';

export const event: EventHandler<'emojiUpdate'> = {
  name: 'emojiUpdate',
  async execute(client: Client<true>, oldEmoji: GuildEmoji, newEmoji: GuildEmoji) {
    const logChannel = await getLogChannel(client, newEmoji.guild.id, 'emoji');
    if (!logChannel) return;

    const canLog = await shouldLog(newEmoji.guild.id, 'emoji', {});
    if (!canLog) return;

    if (oldEmoji.name === newEmoji.name) return;

    const embed = createUpdateEmbed('Emoji Updated')
      .setThumbnail(newEmoji.url)
      .addFields(
        { name: 'Emoji', value: `${newEmoji}`, inline: true },
        { name: 'Name Change', value: `:${oldEmoji.name}: → :${newEmoji.name}:`, inline: true }
      );

    await sendLog(logChannel, embed);
  },
};

export default event;
