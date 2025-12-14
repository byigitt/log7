import { Typing } from 'discord.js';
import { createHandler } from '../../createHandler';
import { Embeds, field, channelField } from '../../../utils';

export const event = createHandler<Typing>({
  name: 'typingStart',
  category: 'presence',
  skip: (t) => !t.inGuild() || t.user.bot,
  getGuild: (t) => t.guild,
  getFilterParams: (t) => ({ userId: t.user.id, channelId: t.channel.id }),
  createEmbed: (t) => Embeds.info('Typing Started', {
    fields: [
      field('User', `<@${t.user.id}> (${t.user.tag})`),
      channelField('Channel', t.channel),
    ],
  }),
});

export default event;
