import { Client, GuildBan } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createCreateEmbed, formatUser, setEmbedAuthor } from '../../../utils';

export const event: EventHandler<'guildBanRemove'> = {
  name: 'guildBanRemove',
  async execute(client: Client<true>, ban: GuildBan) {
    const logChannel = await getLogChannel(client, ban.guild.id, 'ban');
    if (!logChannel) return;

    const canLog = await shouldLog(ban.guild.id, 'ban', {
      userId: ban.user.id,
    });
    if (!canLog) return;

    const embed = createCreateEmbed('Member Unbanned')
      .addFields({ name: 'User', value: formatUser(ban.user), inline: false })
      .setThumbnail(ban.user.displayAvatarURL());

    setEmbedAuthor(embed, ban.user);

    await sendLog(logChannel, embed);
  },
};

export default event;
