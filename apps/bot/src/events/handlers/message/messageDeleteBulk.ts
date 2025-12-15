import { Collection, Message, PartialMessage, Snowflake, GuildTextBasedChannel } from 'discord.js';
import { createDualArgHandler } from '../../createHandler';
import { Embeds, field, channelField } from '../../../utils';

type MessageCollection = Collection<Snowflake, Message | PartialMessage>;

export const event = createDualArgHandler<MessageCollection, GuildTextBasedChannel>({
  name: 'messageDeleteBulk',
  category: 'message',
  getGuild: (_, c) => c.guild,
  getFilterParams: (_, c) => ({ channelId: c.id }),
  createEmbed: (msgs, channel) => Embeds.deleted('Messages Bulk', {
    description: `**${msgs.size}** messages were deleted`,
    fields: [
      channelField('Channel', channel),
      field('Message Count', msgs.size),
    ],
  }),
});

export default event;
