import { GuildEmoji } from 'discord.js';
import { createHandler } from '../../createHandler';
import { Embeds, field } from '../../../utils';

export const event = createHandler<GuildEmoji>({
  name: 'emojiCreate',
  category: 'emoji',
  getGuild: (e) => e.guild,
  createEmbed: (e) => Embeds.created('Emoji', {
    thumbnail: e.url,
    fields: [
      field('Emoji', `${e} \`:${e.name}:\``),
      field('ID', e.id),
      field('Animated', e.animated),
    ],
  }),
});

export default event;
