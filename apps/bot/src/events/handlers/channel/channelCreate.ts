import { NonThreadGuildBasedChannel } from 'discord.js';
import { createHandler } from '../../createHandler';
import { Embeds, field, channelField } from '../../../utils';
import { formatChannelType } from '../../../utils/formatters';

export const event = createHandler<NonThreadGuildBasedChannel>({
  name: 'channelCreate',
  category: 'channel',
  getGuild: (c) => c.guild,
  getFilterParams: (c) => ({ channelId: c.id, categoryId: c.parentId }),
  createEmbed: (c) => Embeds.created('Channel', {
    fields: [
      channelField('Channel', c),
      field('Type', formatChannelType(c.type)),
      field('ID', c.id),
      c.parent ? field('Category', c.parent.name) : null,
    ],
  }),
});

export default event;
