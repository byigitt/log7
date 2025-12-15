import { Collection, Message, PartialMessage, Snowflake, GuildTextBasedChannel } from 'discord.js';
import { createDualArgHandler } from '../../createHandler';
import { Embeds, field, channelField, preserveAttachments } from '../../../utils';

type MessageCollection = Collection<Snowflake, Message | PartialMessage>;

const MAX_ATTACHMENTS = 10;

export const event = createDualArgHandler<MessageCollection, GuildTextBasedChannel>({
  name: 'messageDeleteBulk',
  category: 'message',
  getGuild: (_, c) => c.guild,
  getFilterParams: (_, c) => ({ channelId: c.id }),
  createEmbed: (msgs, channel) => {
    const allAttachments = [...msgs.values()].flatMap(m => [...m.attachments.values()]);
    const attachmentCount = allAttachments.length;
    
    return Embeds.deleted('Messages Bulk', {
      description: `**${msgs.size}** messages were deleted`,
      fields: [
        channelField('Channel', channel),
        field('Message Count', msgs.size),
        attachmentCount > 0 ? field('Attachments', `${attachmentCount} file(s)${attachmentCount > MAX_ATTACHMENTS ? ` (showing first ${MAX_ATTACHMENTS})` : ''}`) : null,
      ],
    });
  },
  getAttachments: async (msgs) => {
    const allAttachments = [...msgs.values()].flatMap(m => [...m.attachments.values()]);
    if (allAttachments.length === 0) return undefined;
    return await preserveAttachments(allAttachments.slice(0, MAX_ATTACHMENTS));
  },
});

export default event;
