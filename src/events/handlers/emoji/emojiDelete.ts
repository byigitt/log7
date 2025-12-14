import { GuildEmoji } from 'discord.js';
import { createHandler } from '../../createHandler';
import { Embeds, field } from '../../../utils';

export const event = createHandler<GuildEmoji>({
  name: 'emojiDelete',
  category: 'emoji',
  getGuild: (e) => e.guild,
  createEmbed: (e) => Embeds.deleted('Emoji', {
    thumbnail: e.url,
    fields: [
      field('Emoji', `:${e.name}:`),
      field('ID', e.id),
    ],
  }),
});

export default event;
