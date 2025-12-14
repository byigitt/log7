import { Invite } from 'discord.js';
import { createHandler } from '../../createHandler';
import { Embeds, field, channelField } from '../../../utils';

export const event = createHandler<Invite>({
  name: 'inviteDelete',
  category: 'invite',
  skip: (i) => !i.guild,
  getGuild: (i) => i.guild,
  getFilterParams: (i) => ({ channelId: i.channel?.id }),
  createEmbed: (i) => Embeds.deleted('Invite', {
    fields: [
      field('Code', i.code),
      i.channel ? channelField('Channel', i.channel) : field('Channel', 'Unknown'),
    ],
  }),
});

export default event;
