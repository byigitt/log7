import { TextBasedChannel } from 'discord.js';
import { createDualArgHandler } from '../../createHandler';
import { Embeds, field, channelField } from '../../../utils';

export const event = createDualArgHandler<TextBasedChannel, Date | null>({
  name: 'channelPinsUpdate',
  category: 'channel',
  skip: (c) => c.isDMBased(),
  getGuild: (c) => c.isDMBased() ? null : c.guild,
  getFilterParams: (c) => ({ channelId: c.id }),
  createEmbed: (c, time) => Embeds.info('Channel Pins Updated', {
    fields: [
      channelField('Channel', c),
      field('Last Pin', time ? `<t:${Math.floor(time.getTime() / 1000)}:R>` : 'None'),
    ],
  }),
});

export default event;
