import { Client, Invite } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createCreateEmbed, formatChannel } from '../../../utils';

export const event: EventHandler<'inviteCreate'> = {
  name: 'inviteCreate',
  async execute(client: Client<true>, invite: Invite) {
    if (!invite.guild) return;

    const logChannel = await getLogChannel(client, invite.guild.id, 'invite');
    if (!logChannel) return;

    const canLog = await shouldLog(invite.guild.id, 'invite', {
      userId: invite.inviterId || undefined,
      channelId: invite.channel?.id,
    });
    if (!canLog) return;

    const embed = createCreateEmbed('Invite Created')
      .addFields(
        { name: 'Code', value: invite.code, inline: true },
        { name: 'Channel', value: invite.channel ? formatChannel(invite.channel) : 'Unknown', inline: true },
        { name: 'Created By', value: invite.inviter ? `${invite.inviter.tag}` : 'Unknown', inline: true },
        { name: 'Max Uses', value: invite.maxUses?.toString() || 'Unlimited', inline: true },
        { name: 'Expires', value: invite.expiresAt ? `<t:${Math.floor(invite.expiresAt.getTime() / 1000)}:R>` : 'Never', inline: true },
        { name: 'Temporary', value: invite.temporary ? 'Yes' : 'No', inline: true }
      );

    await sendLog(logChannel, embed);
  },
};

export default event;
