import { GuildMember, PartialGuildMember } from 'discord.js';
import { createUpdateHandler } from '../../createHandler';
import { Embeds, field, userField, changesField } from '../../../utils';

export const event = createUpdateHandler<GuildMember | PartialGuildMember>({
  name: 'guildMemberUpdate',
  category: 'member',
  getGuild: (_, m) => m.guild,
  getFilterParams: (_, m) => ({ userId: m.id, roleIds: m.roles?.cache.map(r => r.id) }),
  createEmbed: (old, cur) => {
    const oldRoles = old.roles?.cache.filter(r => r.id !== old.guild.id).map(r => r.name) || [];
    const newRoles = cur.roles?.cache.filter(r => r.id !== cur.guild.id).map(r => r.name) || [];
    
    return Embeds.updated('Member', {
      thumbnail: cur.displayAvatarURL(),
      fields: [
        userField('Member', cur.user),
        changesField([
          { label: 'Nickname', old: old.nickname, new: cur.nickname },
          { label: 'Roles', old: oldRoles.join(', ') || 'None', new: newRoles.join(', ') || 'None' },
        ]),
      ],
    });
  },
});

export default event;
