import { Client, Invite } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createDeleteEmbed, formatChannel } from '../../../utils';

export const event: EventHandler<'inviteDelete'> = {
  name: 'inviteDelete',
  async execute(client: Client<true>, invite: Invite) {
    if (!invite.guild) return;

    const logChannel = await getLogChannel(client, invite.guild.id, 'invite');
    if (!logChannel) return;

    const canLog = await shouldLog(invite.guild.id, 'invite', {
      channelId: invite.channel?.id,
    });
    if (!canLog) return;

    const embed = createDeleteEmbed('Invite Deleted')
      .addFields(
        { name: 'Code', value: invite.code, inline: true },
        { name: 'Channel', value: invite.channel ? formatChannel(invite.channel) : 'Unknown', inline: true }
      );

    await sendLog(logChannel, embed);
  },
};

export default event;
