import { Guild } from 'discord.js';
import { createUpdateHandler } from '../../createHandler';
import { Embeds, field, changesField } from '../../../utils';

export const event = createUpdateHandler<Guild>({
  name: 'guildUpdate',
  category: 'guild',
  getGuild: (_, g) => g,
  createEmbed: (old, cur) => Embeds.updated('Server', {
    thumbnail: cur.iconURL() || undefined,
    fields: [
      field('Server', cur.name),
      changesField([
        { label: 'Name', old: old.name, new: cur.name },
        { label: 'Description', old: old.description, new: cur.description },
        { label: 'Verification Level', old: old.verificationLevel, new: cur.verificationLevel },
        { label: 'AFK Timeout', old: old.afkTimeout, new: cur.afkTimeout },
      ]),
    ],
  }),
});

export default event;
