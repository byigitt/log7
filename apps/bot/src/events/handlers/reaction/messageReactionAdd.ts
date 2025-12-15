import { MessageReaction, PartialMessageReaction, User, PartialUser } from 'discord.js';
import { createDualArgHandler } from '../../createHandler';
import { Embeds, field, userField } from '../../../utils';

export const event = createDualArgHandler<MessageReaction | PartialMessageReaction, User | PartialUser>({
  name: 'messageReactionAdd',
  category: 'reaction',
  skip: (r, u) => !r.message.guild || u.bot,
  getGuild: (r) => r.message.guild,
  getFilterParams: (r, u) => ({ userId: u.id, channelId: r.message.channelId }),
  createEmbed: (r, u) => Embeds.created('Reaction Added', {
    fields: [
      userField('User', u as User),
      field('Emoji', r.emoji.toString()),
      field('Message', `[Jump](${r.message.url})`),
    ],
  }),
});

export default event;
