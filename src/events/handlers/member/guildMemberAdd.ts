import { Client, GuildMember } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createCreateEmbed, setEmbedAuthor, formatUser, formatTimestamp, formatRelativeTime } from '../../../utils';

export const event: EventHandler<'guildMemberAdd'> = {
  name: 'guildMemberAdd',
  async execute(client: Client<true>, member: GuildMember) {
    const guild = member.guild;

    const logChannel = await getLogChannel(client, guild.id, 'member');
    if (!logChannel) return;

    const canLog = await shouldLog(guild.id, 'member', {
      userId: member.id,
      roleIds: member.roles.cache.map((r) => r.id),
    });
    if (!canLog) return;

    const embed = createCreateEmbed('Member Joined')
      .addFields(
        { name: 'Member', value: formatUser(member), inline: false },
        { name: 'Account Created', value: `${formatTimestamp(member.user.createdAt)} (${formatRelativeTime(member.user.createdAt)})`, inline: false }
      )
      .setThumbnail(member.displayAvatarURL());

    setEmbedAuthor(embed, member);

    await sendLog(logChannel, embed);
  },
};

export default event;
