import { DMChannel, NonThreadGuildBasedChannel } from 'discord.js';
import { createUpdateHandler } from '../../createHandler';
import { Embeds, field, channelField, changesField } from '../../../utils';

export const event = createUpdateHandler<DMChannel | NonThreadGuildBasedChannel>({
  name: 'channelUpdate',
  category: 'channel',
  skip: (_, c) => c.isDMBased(),
  getGuild: (_, c) => c.isDMBased() ? null : c.guild,
  getFilterParams: (_, c) => ({ channelId: c.id }),
  createEmbed: (old, cur) => {
    if (old.isDMBased() || cur.isDMBased()) return null;
    return Embeds.updated('Channel', {
      fields: [
        channelField('Channel', cur),
        changesField([
          { label: 'Name', old: old.name, new: cur.name },
          { label: 'Topic', old: 'topic' in old ? old.topic : null, new: 'topic' in cur ? cur.topic : null },
          { label: 'NSFW', old: 'nsfw' in old ? old.nsfw : null, new: 'nsfw' in cur ? cur.nsfw : null },
          { label: 'Position', old: old.position, new: cur.position },
        ]),
      ],
    });
  },
});

export default event;
