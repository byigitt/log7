import { Message, PartialMessage } from 'discord.js';
import { createUpdateHandler } from '../../createHandler';
import { Embeds, field, userField, channelField } from '../../../utils';

export const event = createUpdateHandler<Message | PartialMessage>({
  name: 'messageUpdate',
  category: 'message',
  skip: (_, m) => !m.guild || m.author?.bot === true,
  getGuild: (_, m) => m.guild,
  getFilterParams: (_, m) => ({ userId: m.author?.id, channelId: m.channelId }),
  createEmbed: (old, cur) => {
    if (old.content === cur.content) return null;
    return Embeds.updated('Message', {
      fields: [
        cur.author ? userField('Author', cur.author) : field('Author', 'Unknown'),
        channelField('Channel', cur.channel),
        field('Before', old.content?.slice(0, 1024) || '*No content*', false),
        field('After', cur.content?.slice(0, 1024) || '*No content*', false),
        field('Jump', `[Go to message](${cur.url})`),
      ],
    });
  },
});

export default event;
