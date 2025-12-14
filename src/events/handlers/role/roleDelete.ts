import { Role } from 'discord.js';
import { createHandler } from '../../createHandler';
import { Embeds, field } from '../../../utils';

export const event = createHandler<Role>({
  name: 'roleDelete',
  category: 'role',
  getGuild: (r) => r.guild,
  createEmbed: (r) => Embeds.deleted('Role', {
    color: r.color || undefined,
    fields: [
      field('Name', r.name),
      field('ID', r.id),
      field('Color', r.hexColor),
    ],
  }),
});

export default event;
