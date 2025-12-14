import { GuildBan } from 'discord.js';
import { createHandler } from '../../createHandler';
import { Embeds, userField } from '../../../utils';

export const event = createHandler<GuildBan>({
  name: 'guildBanRemove',
  category: 'ban',
  getGuild: (b) => b.guild,
  getFilterParams: (b) => ({ userId: b.user.id }),
  createEmbed: (b) => Embeds.created('User Unbanned', {
    thumbnail: b.user.displayAvatarURL(),
    fields: [
      userField('User', b.user),
    ],
  }),
});

export default event;
