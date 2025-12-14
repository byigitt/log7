import { Client, GuildScheduledEvent, PartialGuildScheduledEvent } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createDeleteEmbed } from '../../../utils';

export const event: EventHandler<'guildScheduledEventDelete'> = {
  name: 'guildScheduledEventDelete',
  async execute(client: Client<true>, scheduledEvent: GuildScheduledEvent | PartialGuildScheduledEvent) {
    if (!scheduledEvent.guild) return;

    const logChannel = await getLogChannel(client, scheduledEvent.guild.id, 'scheduled');
    if (!logChannel) return;

    const canLog = await shouldLog(scheduledEvent.guild.id, 'scheduled', {});
    if (!canLog) return;

    const embed = createDeleteEmbed('Scheduled Event Cancelled')
      .addFields(
        { name: 'Name', value: scheduledEvent.name || 'Unknown', inline: true },
        { name: 'ID', value: scheduledEvent.id, inline: true }
      );

    await sendLog(logChannel, embed);
  },
};

export default event;
