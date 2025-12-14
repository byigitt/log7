import { Client, GuildScheduledEvent, PartialGuildScheduledEvent } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createUpdateEmbed } from '../../../utils';

export const event: EventHandler<'guildScheduledEventUpdate'> = {
  name: 'guildScheduledEventUpdate',
  async execute(
    client: Client<true>,
    oldEvent: GuildScheduledEvent | PartialGuildScheduledEvent | null,
    newEvent: GuildScheduledEvent
  ) {
    if (!newEvent.guild) return;

    const logChannel = await getLogChannel(client, newEvent.guild.id, 'scheduled');
    if (!logChannel) return;

    const canLog = await shouldLog(newEvent.guild.id, 'scheduled', {});
    if (!canLog) return;

    const changes: string[] = [];

    if (oldEvent?.name !== newEvent.name) {
      changes.push(`**Name:** ${oldEvent?.name || 'Unknown'} → ${newEvent.name}`);
    }
    if (oldEvent?.description !== newEvent.description) {
      changes.push(`**Description:** Changed`);
    }
    if (oldEvent?.status !== newEvent.status) {
      changes.push(`**Status:** ${oldEvent?.status || 'Unknown'} → ${newEvent.status}`);
    }

    if (changes.length === 0) return;

    const embed = createUpdateEmbed('Scheduled Event Updated')
      .addFields(
        { name: 'Event', value: newEvent.name, inline: true },
        { name: 'Changes', value: changes.join('\n'), inline: false }
      );

    await sendLog(logChannel, embed);
  },
};

export default event;
