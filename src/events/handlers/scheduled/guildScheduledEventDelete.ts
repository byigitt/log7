import { GuildScheduledEvent } from 'discord.js';
import { createHandler } from '../../createHandler';
import { Embeds, field } from '../../../utils';

export const event = createHandler<GuildScheduledEvent>({
  name: 'guildScheduledEventDelete',
  category: 'scheduled',
  skip: (e) => !e.guild,
  getGuild: (e) => e.guild,
  createEmbed: (e) => Embeds.deleted('Scheduled Event', {
    fields: [
      field('Name', e.name),
      field('ID', e.id),
    ],
  }),
});

export default event;
