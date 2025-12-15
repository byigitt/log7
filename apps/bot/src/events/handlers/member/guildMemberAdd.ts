import { GuildMember } from 'discord.js';
import { createHandler } from '../../createHandler';
import { Embeds, field, userField, relativeTimeField } from '../../../utils';

export const event = createHandler<GuildMember>({
  name: 'guildMemberAdd',
  category: 'member',
  getGuild: (m) => m.guild,
  getFilterParams: (m) => ({ userId: m.id, roleIds: m.roles.cache.map(r => r.id) }),
  createEmbed: (m) => Embeds.created('Member Joined', {
    thumbnail: m.displayAvatarURL(),
    fields: [
      userField('Member', m),
      relativeTimeField('Account Created', m.user.createdAt),
    ],
  }),
});

export default event;
