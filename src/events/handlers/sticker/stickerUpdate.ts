import { Client, Sticker } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createUpdateEmbed } from '../../../utils';

export const event: EventHandler<'stickerUpdate'> = {
  name: 'stickerUpdate',
  async execute(client: Client<true>, oldSticker: Sticker, newSticker: Sticker) {
    if (!newSticker.guild) return;

    const logChannel = await getLogChannel(client, newSticker.guild.id, 'sticker');
    if (!logChannel) return;

    const canLog = await shouldLog(newSticker.guild.id, 'sticker', {});
    if (!canLog) return;

    const changes: string[] = [];

    if (oldSticker.name !== newSticker.name) {
      changes.push(`**Name:** ${oldSticker.name} → ${newSticker.name}`);
    }
    if (oldSticker.description !== newSticker.description) {
      changes.push(`**Description:** ${oldSticker.description || 'None'} → ${newSticker.description || 'None'}`);
    }

    if (changes.length === 0) return;

    const embed = createUpdateEmbed('Sticker Updated')
      .setThumbnail(newSticker.url)
      .addFields({ name: 'Changes', value: changes.join('\n'), inline: false });

    await sendLog(logChannel, embed);
  },
};

export default event;
