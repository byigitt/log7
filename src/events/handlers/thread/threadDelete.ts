import { ThreadChannel } from 'discord.js';
import { createHandler } from '../../createHandler';
import { Embeds, field } from '../../../utils';

export const event = createHandler<ThreadChannel>({
  name: 'threadDelete',
  category: 'thread',
  getGuild: (t) => t.guild,
  getFilterParams: (t) => ({ channelId: t.id }),
  createEmbed: (t) => Embeds.deleted('Thread', {
    fields: [
      field('Name', t.name),
      field('ID', t.id),
    ],
  }),
});

export default event;
