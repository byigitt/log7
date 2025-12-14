import { ThreadChannel } from 'discord.js';
import { createUpdateHandler } from '../../createHandler';
import { Embeds, field, changesField } from '../../../utils';

export const event = createUpdateHandler<ThreadChannel>({
  name: 'threadUpdate',
  category: 'thread',
  getGuild: (_, t) => t.guild,
  getFilterParams: (_, t) => ({ channelId: t.id }),
  createEmbed: (old, cur) => Embeds.updated('Thread', {
    fields: [
      field('Thread', `${cur} (${cur.name})`),
      changesField([
        { label: 'Name', old: old.name, new: cur.name },
        { label: 'Archived', old: old.archived, new: cur.archived },
        { label: 'Locked', old: old.locked, new: cur.locked },
      ]),
    ],
  }),
});

export default event;
