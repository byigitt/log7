import { Client, StageInstance } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createDeleteEmbed } from '../../../utils';

export const event: EventHandler<'stageInstanceDelete'> = {
  name: 'stageInstanceDelete',
  async execute(client: Client<true>, stageInstance: StageInstance) {
    if (!stageInstance.guild) return;

    const logChannel = await getLogChannel(client, stageInstance.guild.id, 'stage');
    if (!logChannel) return;

    const canLog = await shouldLog(stageInstance.guild.id, 'stage', {
      channelId: stageInstance.channelId,
    });
    if (!canLog) return;

    const embed = createDeleteEmbed('Stage Ended')
      .addFields(
        { name: 'Topic', value: stageInstance.topic || 'No topic', inline: true },
        { name: 'Channel', value: `<#${stageInstance.channelId}>`, inline: true }
      );

    await sendLog(logChannel, embed);
  },
};

export default event;
