import { StageInstance } from 'discord.js';
import { createUpdateHandler } from '../../createHandler';
import { Embeds, field, changesField } from '../../../utils';

export const event = createUpdateHandler<StageInstance | null>({
  name: 'stageInstanceUpdate',
  category: 'stage',
  skip: (old, cur) => !old || !cur,
  getGuild: (_, s) => s?.guild || null,
  getFilterParams: (_, s) => ({ channelId: s?.channelId }),
  createEmbed: (old, cur) => {
    if (!old || !cur) return null;
    return Embeds.updated('Stage', {
      fields: [
        field('Topic', cur.topic),
        changesField([
          { label: 'Topic', old: old.topic, new: cur.topic },
          { label: 'Privacy', old: old.privacyLevel, new: cur.privacyLevel },
        ]),
      ],
    });
  },
});

export default event;
