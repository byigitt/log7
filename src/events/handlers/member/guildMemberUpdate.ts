import { Client, GuildMember, PartialGuildMember } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createUpdateEmbed, setEmbedAuthor, formatUser } from '../../../utils';

export const event: EventHandler<'guildMemberUpdate'> = {
  name: 'guildMemberUpdate',
  async execute(client: Client<true>, oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) {
    const guild = newMember.guild;

    const logChannel = await getLogChannel(client, guild.id, 'member');
    if (!logChannel) return;

    const canLog = await shouldLog(guild.id, 'member', {
      userId: newMember.id,
      roleIds: newMember.roles.cache.map((r) => r.id),
    });
    if (!canLog) return;

    const changes: string[] = [];

    if (oldMember.nickname !== newMember.nickname) {
      changes.push(`**Nickname:** ${oldMember.nickname || 'None'} → ${newMember.nickname || 'None'}`);
    }

    const oldRoles = oldMember.roles.cache;
    const newRoles = newMember.roles.cache;

    const addedRoles = newRoles.filter((r) => !oldRoles.has(r.id));
    const removedRoles = oldRoles.filter((r) => !newRoles.has(r.id));

    if (addedRoles.size > 0) {
      changes.push(`**Roles Added:** ${addedRoles.map((r) => r.toString()).join(', ')}`);
    }

    if (removedRoles.size > 0) {
      changes.push(`**Roles Removed:** ${removedRoles.map((r) => r.toString()).join(', ')}`);
    }

    if (oldMember.communicationDisabledUntil !== newMember.communicationDisabledUntil) {
      if (newMember.communicationDisabledUntil) {
        changes.push(`**Timeout:** Until <t:${Math.floor(newMember.communicationDisabledUntil.getTime() / 1000)}:F>`);
      } else {
        changes.push(`**Timeout:** Removed`);
      }
    }

    if (oldMember.avatar !== newMember.avatar) {
      changes.push(`**Server Avatar:** Changed`);
    }

    if (changes.length === 0) return;

    const embed = createUpdateEmbed('Member Updated')
      .addFields(
        { name: 'Member', value: formatUser(newMember), inline: false },
        { name: 'Changes', value: changes.join('\n'), inline: false }
      )
      .setThumbnail(newMember.displayAvatarURL());

    setEmbedAuthor(embed, newMember);

    await sendLog(logChannel, embed);
  },
};

export default event;
