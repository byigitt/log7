import { Role } from 'discord.js';
import { createHandler } from '../../createHandler';
import { Embeds, field, roleField } from '../../../utils';

export const event = createHandler<Role>({
  name: 'roleCreate',
  category: 'role',
  getGuild: (r) => r.guild,
  createEmbed: (r) => Embeds.created('Role', {
    color: r.color || undefined,
    fields: [
      roleField('Role', r),
      field('Color', r.hexColor),
      field('Hoisted', r.hoist),
      field('Mentionable', r.mentionable),
      field('Position', r.position),
    ],
  }),
});

export default event;
