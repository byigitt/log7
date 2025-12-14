import { Client, ThreadChannel } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createDeleteEmbed } from '../../../utils';

export const event: EventHandler<'threadDelete'> = {
  name: 'threadDelete',
  async execute(client: Client<true>, thread: ThreadChannel) {
    if (!thread.guild) return;

    const logChannel = await getLogChannel(client, thread.guild.id, 'thread');
    if (!logChannel) return;

    const canLog = await shouldLog(thread.guild.id, 'thread', {
      channelId: thread.id,
    });
    if (!canLog) return;

    const embed = createDeleteEmbed('Thread Deleted')
      .addFields(
        { name: 'Thread', value: `${thread.name} (${thread.id})`, inline: true },
        { name: 'Parent', value: thread.parent?.name || 'Unknown', inline: true }
      );

    await sendLog(logChannel, embed);
  },
};

export default event;
