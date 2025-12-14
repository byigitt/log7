import { Client, Presence } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createInfoEmbed, formatUser } from '../../../utils';

export const event: EventHandler<'presenceUpdate'> = {
  name: 'presenceUpdate',
  async execute(client: Client<true>, oldPresence: Presence | null, newPresence: Presence) {
    if (!newPresence.guild) return;
    if (newPresence.user?.bot) return;

    const logChannel = await getLogChannel(client, newPresence.guild.id, 'presence');
    if (!logChannel) return;

    const canLog = await shouldLog(newPresence.guild.id, 'presence', {
      userId: newPresence.userId,
    });
    if (!canLog) return;

    if (oldPresence?.status === newPresence.status) return;

    const embed = createInfoEmbed('Presence Updated')
      .addFields(
        { name: 'User', value: newPresence.user ? formatUser(newPresence.user) : `<@${newPresence.userId}>`, inline: true },
        { name: 'Status', value: `${oldPresence?.status || 'offline'} → ${newPresence.status}`, inline: true }
      );

    await sendLog(logChannel, embed);
  },
};

export default event;
