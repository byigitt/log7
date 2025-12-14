import { ThreadChannel } from 'discord.js';
import { createDualArgHandler } from '../../createHandler';
import { Embeds, field, channelField } from '../../../utils';

export const event = createDualArgHandler<ThreadChannel, boolean>({
  name: 'threadCreate',
  category: 'thread',
  skip: (_, newlyCreated) => !newlyCreated,
  getGuild: (t) => t.guild,
  getFilterParams: (t) => ({ channelId: t.id, categoryId: t.parent?.parentId }),
  createEmbed: (t) => Embeds.created('Thread', {
    fields: [
      field('Thread', `${t} (${t.name} | ${t.id})`),
      t.parent ? channelField('Parent', t.parent) : field('Parent', 'Unknown'),
      t.ownerId ? field('Created By', `<@${t.ownerId}>`) : null,
    ],
  }),
});

export default event;
