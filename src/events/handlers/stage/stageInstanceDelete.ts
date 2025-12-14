import { StageInstance } from 'discord.js';
import { createHandler } from '../../createHandler';
import { Embeds, field } from '../../../utils';

export const event = createHandler<StageInstance>({
  name: 'stageInstanceDelete',
  category: 'stage',
  getGuild: (s) => s.guild,
  getFilterParams: (s) => ({ channelId: s.channelId }),
  createEmbed: (s) => Embeds.deleted('Stage', {
    fields: [
      field('Topic', s.topic),
      field('Channel ID', s.channelId),
    ],
  }),
});

export default event;
