import { Client, Sticker } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createCreateEmbed } from '../../../utils';

export const event: EventHandler<'stickerCreate'> = {
  name: 'stickerCreate',
  async execute(client: Client<true>, sticker: Sticker) {
    if (!sticker.guild) return;

    const logChannel = await getLogChannel(client, sticker.guild.id, 'sticker');
    if (!logChannel) return;

    const canLog = await shouldLog(sticker.guild.id, 'sticker', {});
    if (!canLog) return;

    const embed = createCreateEmbed('Sticker Created')
      .setThumbnail(sticker.url)
      .addFields(
        { name: 'Name', value: sticker.name, inline: true },
        { name: 'ID', value: sticker.id, inline: true },
        { name: 'Description', value: sticker.description || 'None', inline: false }
      );

    await sendLog(logChannel, embed);
  },
};

export default event;
