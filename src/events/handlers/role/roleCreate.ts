import { Client, Role } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createCreateEmbed, formatRole } from '../../../utils';

export const event: EventHandler<'roleCreate'> = {
  name: 'roleCreate',
  async execute(client: Client<true>, role: Role) {
    const logChannel = await getLogChannel(client, role.guild.id, 'role');
    if (!logChannel) return;

    const canLog = await shouldLog(role.guild.id, 'role', {});
    if (!canLog) return;

    const embed = createCreateEmbed('Role Created')
      .setColor(role.color || 0x99aab5)
      .addFields(
        { name: 'Role', value: formatRole(role), inline: true },
        { name: 'Color', value: role.hexColor, inline: true },
        { name: 'Hoisted', value: role.hoist ? 'Yes' : 'No', inline: true },
        { name: 'Mentionable', value: role.mentionable ? 'Yes' : 'No', inline: true },
        { name: 'Position', value: role.position.toString(), inline: true }
      );

    await sendLog(logChannel, embed);
  },
};

export default event;
