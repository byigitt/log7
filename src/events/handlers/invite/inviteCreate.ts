import { Invite } from 'discord.js';
import { createHandler } from '../../createHandler';
import { Embeds, field, channelField } from '../../../utils';

export const event = createHandler<Invite>({
  name: 'inviteCreate',
  category: 'invite',
  skip: (i) => !i.guild,
  getGuild: (i) => i.guild,
  getFilterParams: (i) => ({ userId: i.inviterId || undefined, channelId: i.channel?.id }),
  createEmbed: (i) => Embeds.created('Invite', {
    fields: [
      field('Code', i.code),
      i.channel ? channelField('Channel', i.channel) : field('Channel', 'Unknown'),
      field('Created By', i.inviter?.tag || 'Unknown'),
      field('Max Uses', i.maxUses || 'Unlimited'),
      field('Expires', i.expiresAt ? `<t:${Math.floor(i.expiresAt.getTime() / 1000)}:R>` : 'Never'),
      field('Temporary', i.temporary),
    ],
  }),
});

export default event;
