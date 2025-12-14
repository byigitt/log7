import { Client, GuildScheduledEvent } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createCreateEmbed, formatTimestamp } from '../../../utils';

export const event: EventHandler<'guildScheduledEventCreate'> = {
  name: 'guildScheduledEventCreate',
  async execute(client: Client<true>, scheduledEvent: GuildScheduledEvent) {
    if (!scheduledEvent.guild) return;

    const logChannel = await getLogChannel(client, scheduledEvent.guild.id, 'scheduled');
    if (!logChannel) return;

    const canLog = await shouldLog(scheduledEvent.guild.id, 'scheduled', {});
    if (!canLog) return;

    const embed = createCreateEmbed('Scheduled Event Created')
      .addFields(
        { name: 'Name', value: scheduledEvent.name, inline: true },
        { name: 'Start Time', value: scheduledEvent.scheduledStartAt ? formatTimestamp(scheduledEvent.scheduledStartAt) : 'Unknown', inline: true },
        { name: 'Location', value: scheduledEvent.channel?.name || scheduledEvent.entityMetadata?.location || 'Unknown', inline: true }
      );

    if (scheduledEvent.description) {
      embed.addFields({ name: 'Description', value: scheduledEvent.description.slice(0, 1024), inline: false });
    }

    if (scheduledEvent.creator) {
      embed.addFields({ name: 'Created By', value: scheduledEvent.creator.tag, inline: true });
    }

    await sendLog(logChannel, embed);
  },
};

export default event;
