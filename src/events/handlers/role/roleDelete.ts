import { Client, Role } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createDeleteEmbed } from '../../../utils';

export const event: EventHandler<'roleDelete'> = {
  name: 'roleDelete',
  async execute(client: Client<true>, role: Role) {
    const logChannel = await getLogChannel(client, role.guild.id, 'role');
    if (!logChannel) return;

    const canLog = await shouldLog(role.guild.id, 'role', {});
    if (!canLog) return;

    const embed = createDeleteEmbed('Role Deleted')
      .setColor(role.color || 0x99aab5)
      .addFields(
        { name: 'Role', value: `${role.name} (${role.id})`, inline: true },
        { name: 'Color', value: role.hexColor, inline: true }
      );

    await sendLog(logChannel, embed);
  },
};

export default event;
