import { Client, DMChannel, NonThreadGuildBasedChannel, TextChannel } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createUpdateEmbed, formatChannel } from '../../../utils';

export const event: EventHandler<'channelUpdate'> = {
  name: 'channelUpdate',
  async execute(
    client: Client<true>,
    oldChannel: DMChannel | NonThreadGuildBasedChannel,
    newChannel: DMChannel | NonThreadGuildBasedChannel
  ) {
    if (oldChannel.isDMBased() || newChannel.isDMBased()) return;

    const guild = newChannel.guild;

    const logChannel = await getLogChannel(client, guild.id, 'channel');
    if (!logChannel) return;

    const canLog = await shouldLog(guild.id, 'channel', {
      channelId: newChannel.id,
      categoryId: newChannel.parentId,
    });
    if (!canLog) return;

    const changes: string[] = [];

    if (oldChannel.name !== newChannel.name) {
      changes.push(`**Name:** ${oldChannel.name} → ${newChannel.name}`);
    }

    if (oldChannel.parentId !== newChannel.parentId) {
      const oldParent = oldChannel.parent?.name ?? 'None';
      const newParent = newChannel.parent?.name ?? 'None';
      changes.push(`**Category:** ${oldParent} → ${newParent}`);
    }

    if ('topic' in oldChannel && 'topic' in newChannel) {
      const oldTopic = (oldChannel as TextChannel).topic ?? 'None';
      const newTopic = (newChannel as TextChannel).topic ?? 'None';
      if (oldTopic !== newTopic) {
        changes.push(`**Topic:** ${oldTopic || 'None'} → ${newTopic || 'None'}`);
      }
    }

    if ('nsfw' in oldChannel && 'nsfw' in newChannel) {
      if ((oldChannel as TextChannel).nsfw !== (newChannel as TextChannel).nsfw) {
        changes.push(`**NSFW:** ${(oldChannel as TextChannel).nsfw} → ${(newChannel as TextChannel).nsfw}`);
      }
    }

    if ('rateLimitPerUser' in oldChannel && 'rateLimitPerUser' in newChannel) {
      const oldLimit = (oldChannel as TextChannel).rateLimitPerUser;
      const newLimit = (newChannel as TextChannel).rateLimitPerUser;
      if (oldLimit !== newLimit) {
        changes.push(`**Slowmode:** ${oldLimit}s → ${newLimit}s`);
      }
    }

    if (changes.length === 0) return;

    const embed = createUpdateEmbed('Channel Updated')
      .addFields(
        { name: 'Channel', value: formatChannel(newChannel), inline: false },
        { name: 'Changes', value: changes.join('\n'), inline: false }
      );

    await sendLog(logChannel, embed);
  },
};

export default event;
