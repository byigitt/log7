import { GuildBan } from 'discord.js';
import { createHandler } from '../../createHandler';
import { Embeds, field, userField } from '../../../utils';

export const event = createHandler<GuildBan>({
  name: 'guildBanAdd',
  category: 'ban',
  getGuild: (b) => b.guild,
  getFilterParams: (b) => ({ userId: b.user.id }),
  createEmbed: (b) => Embeds.deleted('User Banned', {
    thumbnail: b.user.displayAvatarURL(),
    fields: [
      userField('User', b.user),
      field('Reason', b.reason || 'No reason provided', false),
    ],
  }),
});

export default event;
