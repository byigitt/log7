import { Sticker } from 'discord.js';
import { createHandler } from '../../createHandler';
import { Embeds, field } from '../../../utils';

export const event = createHandler<Sticker>({
  name: 'stickerDelete',
  category: 'sticker',
  skip: (s) => !s.guild,
  getGuild: (s) => s.guild,
  createEmbed: (s) => Embeds.deleted('Sticker', {
    thumbnail: s.url,
    fields: [
      field('Name', s.name),
      field('ID', s.id),
    ],
  }),
});

export default event;
