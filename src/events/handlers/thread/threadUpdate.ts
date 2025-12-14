import { Client, ThreadChannel } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createUpdateEmbed, formatChannel } from '../../../utils';

export const event: EventHandler<'threadUpdate'> = {
  name: 'threadUpdate',
  async execute(client: Client<true>, oldThread: ThreadChannel, newThread: ThreadChannel) {
    if (!newThread.guild) return;

    const logChannel = await getLogChannel(client, newThread.guild.id, 'thread');
    if (!logChannel) return;

    const canLog = await shouldLog(newThread.guild.id, 'thread', {
      channelId: newThread.id,
    });
    if (!canLog) return;

    const changes: string[] = [];

    if (oldThread.name !== newThread.name) {
      changes.push(`**Name:** ${oldThread.name} → ${newThread.name}`);
    }
    if (oldThread.archived !== newThread.archived) {
      changes.push(`**Archived:** ${oldThread.archived} → ${newThread.archived}`);
    }
    if (oldThread.locked !== newThread.locked) {
      changes.push(`**Locked:** ${oldThread.locked} → ${newThread.locked}`);
    }
    if (oldThread.rateLimitPerUser !== newThread.rateLimitPerUser) {
      changes.push(`**Slowmode:** ${oldThread.rateLimitPerUser}s → ${newThread.rateLimitPerUser}s`);
    }

    if (changes.length === 0) return;

    const embed = createUpdateEmbed('Thread Updated')
      .addFields(
        { name: 'Thread', value: `${newThread} (${newThread.name} | ${newThread.id})`, inline: false },
        { name: 'Changes', value: changes.join('\n'), inline: false }
      );

    await sendLog(logChannel, embed);
  },
};

export default event;
