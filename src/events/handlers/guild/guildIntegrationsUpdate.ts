import { Client, Guild } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createInfoEmbed } from '../../../utils';

export const event: EventHandler<'guildIntegrationsUpdate'> = {
  name: 'guildIntegrationsUpdate',
  async execute(client: Client<true>, guild: Guild) {
    const logChannel = await getLogChannel(client, guild.id, 'guild');
    if (!logChannel) return;

    const canLog = await shouldLog(guild.id, 'guild', {});
    if (!canLog) return;

    const embed = createInfoEmbed('Server Integrations Updated')
      .setDescription('The server integrations have been updated.')
      .setThumbnail(guild.iconURL());

    await sendLog(logChannel, embed);
  },
};

export default event;
