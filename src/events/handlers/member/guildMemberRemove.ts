import { Client, GuildMember, PartialGuildMember } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createDeleteEmbed, setEmbedAuthor, formatUser, formatTimestamp, formatRelativeTime } from '../../../utils';

export const event: EventHandler<'guildMemberRemove'> = {
  name: 'guildMemberRemove',
  async execute(client: Client<true>, member: GuildMember | PartialGuildMember) {
    const guild = member.guild;

    const logChannel = await getLogChannel(client, guild.id, 'member');
    if (!logChannel) return;

    const canLog = await shouldLog(guild.id, 'member', {
      userId: member.id,
      roleIds: member.roles.cache.map((r) => r.id),
    });
    if (!canLog) return;

    const embed = createDeleteEmbed('Member Left')
      .addFields(
        { name: 'Member', value: formatUser(member.user), inline: false }
      );

    if (member.joinedAt) {
      embed.addFields(
        { name: 'Joined', value: `${formatTimestamp(member.joinedAt)} (${formatRelativeTime(member.joinedAt)})`, inline: false }
      );
    }

    const roles = member.roles.cache.filter((r) => r.id !== guild.id);
    if (roles.size > 0) {
      embed.addFields({
        name: `Roles (${roles.size})`,
        value: roles.map((r) => r.toString()).join(', ').slice(0, 1024) || 'None',
        inline: false,
      });
    }

    embed.setThumbnail(member.displayAvatarURL());
    setEmbedAuthor(embed, member.user);

    await sendLog(logChannel, embed);
  },
};

export default event;
