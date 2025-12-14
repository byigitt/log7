import { Client, StageInstance } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createUpdateEmbed } from '../../../utils';

export const event: EventHandler<'stageInstanceUpdate'> = {
  name: 'stageInstanceUpdate',
  async execute(client: Client<true>, oldStage: StageInstance | null, newStage: StageInstance) {
    if (!newStage.guild) return;

    const logChannel = await getLogChannel(client, newStage.guild.id, 'stage');
    if (!logChannel) return;

    const canLog = await shouldLog(newStage.guild.id, 'stage', {
      channelId: newStage.channelId,
    });
    if (!canLog) return;

    const changes: string[] = [];

    if (oldStage?.topic !== newStage.topic) {
      changes.push(`**Topic:** ${oldStage?.topic || 'None'} → ${newStage.topic || 'None'}`);
    }

    if (changes.length === 0) return;

    const embed = createUpdateEmbed('Stage Updated')
      .addFields(
        { name: 'Channel', value: `<#${newStage.channelId}>`, inline: true },
        { name: 'Changes', value: changes.join('\n'), inline: false }
      );

    await sendLog(logChannel, embed);
  },
};

export default event;
