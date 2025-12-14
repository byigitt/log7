import { Client, ThreadChannel } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createCreateEmbed, formatChannel } from '../../../utils';

export const event: EventHandler<'threadCreate'> = {
  name: 'threadCreate',
  async execute(client: Client<true>, thread: ThreadChannel, newlyCreated: boolean) {
    if (!newlyCreated) return;
    if (!thread.guild) return;

    const logChannel = await getLogChannel(client, thread.guild.id, 'thread');
    if (!logChannel) return;

    const canLog = await shouldLog(thread.guild.id, 'thread', {
      channelId: thread.id,
      categoryId: thread.parent?.parentId,
    });
    if (!canLog) return;

    const embed = createCreateEmbed('Thread Created')
      .addFields(
        { name: 'Thread', value: `${thread} (${thread.name} | ${thread.id})`, inline: true },
        { name: 'Parent', value: thread.parent ? `${thread.parent} (${thread.parent.name})` : 'Unknown', inline: true }
      );

    if (thread.ownerId) {
      embed.addFields({ name: 'Created By', value: `<@${thread.ownerId}>`, inline: true });
    }

    await sendLog(logChannel, embed);
  },
};

export default event;
