import { Role } from 'discord.js';
import { createUpdateHandler } from '../../createHandler';
import { Embeds, field, roleField, changesField } from '../../../utils';

export const event = createUpdateHandler<Role>({
  name: 'roleUpdate',
  category: 'role',
  getGuild: (_, r) => r.guild,
  createEmbed: (old, cur) => Embeds.updated('Role', {
    color: cur.color || undefined,
    fields: [
      roleField('Role', cur),
      changesField([
        { label: 'Name', old: old.name, new: cur.name },
        { label: 'Color', old: old.hexColor, new: cur.hexColor },
        { label: 'Hoisted', old: old.hoist, new: cur.hoist },
        { label: 'Mentionable', old: old.mentionable, new: cur.mentionable },
        { label: 'Position', old: old.position, new: cur.position },
      ]),
    ],
  }),
});

export default event;
