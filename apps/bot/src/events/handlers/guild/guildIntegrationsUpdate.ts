import { Guild } from 'discord.js';
import { createHandler } from '../../createHandler';
import { Embeds, field } from '../../../utils';

export const event = createHandler<Guild>({
  name: 'guildIntegrationsUpdate',
  category: 'guild',
  getGuild: (g) => g,
  createEmbed: (g) => Embeds.info('Integrations Updated', {
    thumbnail: g.iconURL() || undefined,
    fields: [
      field('Server', g.name),
      field('ID', g.id),
    ],
  }),
});

export default event;
