import { Message, PartialMessage, MessageReaction, Collection } from 'discord.js';
import { createDualArgHandler } from '../../createHandler';
import { Embeds, field, channelField } from '../../../utils';

type ReactionCollection = Collection<string, MessageReaction>;

export const event = createDualArgHandler<Message | PartialMessage, ReactionCollection>({
  name: 'messageReactionRemoveAll',
  category: 'reaction',
  skip: (m) => !m.guild,
  getGuild: (m) => m.guild,
  getFilterParams: (m) => ({ channelId: m.channelId }),
  createEmbed: (m, reactions) => Embeds.deleted('All Reactions Removed', {
    fields: [
      channelField('Channel', m.channel),
      field('Message', `[Jump](${m.url})`),
      field('Reactions Cleared', reactions.size),
    ],
  }),
});

export default event;
