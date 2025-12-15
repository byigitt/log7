import { Message, PartialMessage } from 'discord.js';
import { createHandler } from '../../createHandler';
import { Embeds, field, userField, channelField } from '../../../utils';

export const event = createHandler<Message | PartialMessage>({
  name: 'messageDelete',
  category: 'message',
  skip: (m) => !m.guild || m.author?.bot === true,
  getGuild: (m) => m.guild,
  getFilterParams: (m) => ({ userId: m.author?.id, channelId: m.channelId, categoryId: 'parentId' in m.channel ? m.channel.parentId : null }),
  createEmbed: (m) => Embeds.deleted('Message', {
    fields: [
      m.author ? userField('Author', m.author) : field('Author', 'Unknown'),
      channelField('Channel', m.channel),
      field('Content', m.content?.slice(0, 1024) || '*No content*', false),
      m.attachments.size > 0 ? field('Attachments', m.attachments.map(a => a.name).join(', '), false) : null,
    ],
  }),
});

export default event;
