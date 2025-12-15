import { GuildMember, PartialGuildMember } from 'discord.js';
import { createHandler } from '../../createHandler';
import { Embeds, field, userField } from '../../../utils';

export const event = createHandler<GuildMember | PartialGuildMember>({
  name: 'guildMemberRemove',
  category: 'member',
  getGuild: (m) => m.guild,
  getFilterParams: (m) => ({ userId: m.id }),
  createEmbed: (m) => Embeds.deleted('Member Left', {
    thumbnail: m.displayAvatarURL(),
    fields: [
      userField('Member', m.user),
      field('Roles', m.roles?.cache.filter(r => r.id !== m.guild.id).map(r => r.name).join(', ') || 'None', false),
    ],
  }),
});

export default event;
