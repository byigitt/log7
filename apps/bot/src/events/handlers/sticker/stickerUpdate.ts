import { Sticker } from 'discord.js';
import { createUpdateHandler } from '../../createHandler';
import { Embeds, field, changesField } from '../../../utils';

export const event = createUpdateHandler<Sticker>({
  name: 'stickerUpdate',
  category: 'sticker',
  skip: (_, s) => !s.guild,
  getGuild: (_, s) => s.guild,
  createEmbed: (old, cur) => Embeds.updated('Sticker', {
    thumbnail: cur.url,
    fields: [
      field('Name', cur.name),
      field('ID', cur.id),
      changesField([
        { label: 'Name', old: old.name, new: cur.name },
        { label: 'Description', old: old.description, new: cur.description },
      ]),
    ],
  }),
});

export default event;
