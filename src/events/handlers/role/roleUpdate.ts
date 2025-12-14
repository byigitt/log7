import { Client, Role } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createUpdateEmbed, formatRole } from '../../../utils';

export const event: EventHandler<'roleUpdate'> = {
  name: 'roleUpdate',
  async execute(client: Client<true>, oldRole: Role, newRole: Role) {
    const logChannel = await getLogChannel(client, newRole.guild.id, 'role');
    if (!logChannel) return;

    const canLog = await shouldLog(newRole.guild.id, 'role', {});
    if (!canLog) return;

    const changes: string[] = [];

    if (oldRole.name !== newRole.name) {
      changes.push(`**Name:** ${oldRole.name} → ${newRole.name}`);
    }
    if (oldRole.color !== newRole.color) {
      changes.push(`**Color:** ${oldRole.hexColor} → ${newRole.hexColor}`);
    }
    if (oldRole.hoist !== newRole.hoist) {
      changes.push(`**Hoisted:** ${oldRole.hoist} → ${newRole.hoist}`);
    }
    if (oldRole.mentionable !== newRole.mentionable) {
      changes.push(`**Mentionable:** ${oldRole.mentionable} → ${newRole.mentionable}`);
    }
    if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
      changes.push(`**Permissions:** Changed`);
    }

    if (changes.length === 0) return;

    const embed = createUpdateEmbed('Role Updated')
      .setColor(newRole.color || 0x99aab5)
      .addFields(
        { name: 'Role', value: formatRole(newRole), inline: false },
        { name: 'Changes', value: changes.join('\n'), inline: false }
      );

    await sendLog(logChannel, embed);
  },
};

export default event;
