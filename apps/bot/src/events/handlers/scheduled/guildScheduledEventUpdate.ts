import { GuildScheduledEvent } from 'discord.js';
import { createUpdateHandler } from '../../createHandler';
import { Embeds, field, changesField } from '../../../utils';

export const event = createUpdateHandler<GuildScheduledEvent | null>({
  name: 'guildScheduledEventUpdate',
  category: 'scheduled',
  skip: (old, cur) => !old || !cur || !cur.guild,
  getGuild: (_, cur) => cur?.guild || null,
  createEmbed: (old, cur) => {
    if (!old || !cur) return null;
    return Embeds.updated('Scheduled Event', {
      thumbnail: cur.coverImageURL?.() || undefined,
      fields: [
        field('Name', cur.name),
        changesField([
          { label: 'Name', old: old.name, new: cur.name },
          { label: 'Description', old: old.description, new: cur.description },
          { label: 'Status', old: old.status, new: cur.status },
          { label: 'Location', old: old.channel?.name || old.entityMetadata?.location, new: cur.channel?.name || cur.entityMetadata?.location },
        ]),
      ],
    });
  },
});

export default event;
