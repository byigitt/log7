import { Client, StageInstance } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createCreateEmbed } from '../../../utils';

export const event: EventHandler<'stageInstanceCreate'> = {
  name: 'stageInstanceCreate',
  async execute(client: Client<true>, stageInstance: StageInstance) {
    if (!stageInstance.guild) return;

    const logChannel = await getLogChannel(client, stageInstance.guild.id, 'stage');
    if (!logChannel) return;

    const canLog = await shouldLog(stageInstance.guild.id, 'stage', {
      channelId: stageInstance.channelId,
    });
    if (!canLog) return;

    const embed = createCreateEmbed('Stage Started')
      .addFields(
        { name: 'Topic', value: stageInstance.topic || 'No topic', inline: true },
        { name: 'Channel', value: `<#${stageInstance.channelId}>`, inline: true }
      );

    await sendLog(logChannel, embed);
  },
};

export default event;
