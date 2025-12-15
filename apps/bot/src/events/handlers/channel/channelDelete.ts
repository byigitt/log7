import { DMChannel, NonThreadGuildBasedChannel } from 'discord.js';
import { createHandler } from '../../createHandler';
import { Embeds, field } from '../../../utils';
import { formatChannelType } from '../../../utils/formatters';

export const event = createHandler<DMChannel | NonThreadGuildBasedChannel>({
  name: 'channelDelete',
  category: 'channel',
  skip: (c) => c.isDMBased(),
  getGuild: (c) => c.isDMBased() ? null : c.guild,
  getFilterParams: (c) => ({ channelId: c.id }),
  createEmbed: (c) => Embeds.deleted('Channel', {
    fields: [
      field('Name', 'name' in c ? c.name : 'Unknown'),
      field('Type', formatChannelType(c.type)),
      field('ID', c.id),
    ],
  }),
});

export default event;
