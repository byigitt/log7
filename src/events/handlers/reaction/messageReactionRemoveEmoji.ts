import { MessageReaction, PartialMessageReaction } from 'discord.js';
import { createHandler } from '../../createHandler';
import { Embeds, field, channelField } from '../../../utils';

export const event = createHandler<MessageReaction | PartialMessageReaction>({
  name: 'messageReactionRemoveEmoji',
  category: 'reaction',
  skip: (r) => !r.message.guild,
  getGuild: (r) => r.message.guild,
  getFilterParams: (r) => ({ channelId: r.message.channelId }),
  createEmbed: (r) => Embeds.deleted('Emoji Reactions Removed', {
    fields: [
      field('Emoji', r.emoji.toString()),
      channelField('Channel', r.message.channel),
      field('Message', `[Jump](${r.message.url})`),
    ],
  }),
});

export default event;
