import { Sticker } from 'discord.js';
import { createHandler } from '../../createHandler';
import { Embeds, field } from '../../../utils';

export const event = createHandler<Sticker>({
  name: 'stickerCreate',
  category: 'sticker',
  skip: (s) => !s.guild,
  getGuild: (s) => s.guild,
  createEmbed: (s) => Embeds.created('Sticker', {
    thumbnail: s.url,
    fields: [
      field('Name', s.name),
      field('ID', s.id),
      field('Description', s.description || 'None', false),
    ],
  }),
});

export default event;
