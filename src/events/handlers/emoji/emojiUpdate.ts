import { GuildEmoji } from 'discord.js';
import { createUpdateHandler } from '../../createHandler';
import { Embeds, field } from '../../../utils';

export const event = createUpdateHandler<GuildEmoji>({
  name: 'emojiUpdate',
  category: 'emoji',
  getGuild: (_, e) => e.guild,
  skip: (old, cur) => old.name === cur.name,
  createEmbed: (old, cur) => Embeds.updated('Emoji', {
    thumbnail: cur.url,
    fields: [
      field('Emoji', `${cur}`),
      field('Name Change', `:${old.name}: → :${cur.name}:`),
    ],
  }),
});

export default event;
