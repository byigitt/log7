import { StageInstance } from 'discord.js';
import { createHandler } from '../../createHandler';
import { Embeds, field, channelField } from '../../../utils';

export const event = createHandler<StageInstance>({
  name: 'stageInstanceCreate',
  category: 'stage',
  getGuild: (s) => s.guild,
  getFilterParams: (s) => ({ channelId: s.channelId }),
  createEmbed: (s) => Embeds.created('Stage', {
    fields: [
      field('Topic', s.topic),
      s.channel ? channelField('Channel', s.channel) : field('Channel ID', s.channelId),
    ],
  }),
});

export default event;
