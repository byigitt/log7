import { GuildScheduledEvent } from 'discord.js';
import { createHandler } from '../../createHandler';
import { Embeds, field, timestampField } from '../../../utils';

export const event = createHandler<GuildScheduledEvent>({
  name: 'guildScheduledEventCreate',
  category: 'scheduled',
  skip: (e) => !e.guild,
  getGuild: (e) => e.guild,
  createEmbed: (e) => Embeds.created('Scheduled Event', {
    thumbnail: e.coverImageURL?.() || undefined,
    fields: [
      field('Name', e.name),
      timestampField('Start Time', e.scheduledStartAt),
      field('Location', e.channel?.name || e.entityMetadata?.location || 'Unknown'),
      e.description ? field('Description', e.description.slice(0, 1024), false) : null,
      e.creator ? field('Created By', e.creator.tag) : null,
    ],
  }),
});

export default event;
