import { Client, AutoModerationActionExecution } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createInfoEmbed, truncate } from '../../../utils';
import { Colors } from '../../../constants';

export const event: EventHandler<'autoModerationActionExecution'> = {
  name: 'autoModerationActionExecution',
  async execute(client: Client<true>, execution: AutoModerationActionExecution) {
    const logChannel = await getLogChannel(client, execution.guild.id, 'automod');
    if (!logChannel) return;

    const canLog = await shouldLog(execution.guild.id, 'automod', {
      userId: execution.userId,
      channelId: execution.channelId || undefined,
    });
    if (!canLog) return;

    const embed = createInfoEmbed('AutoMod Action Executed')
      .setColor(Colors.RED)
      .addFields(
        { name: 'User', value: `<@${execution.userId}>`, inline: true },
        { name: 'Rule', value: execution.ruleTriggerType.toString(), inline: true },
        { name: 'Action', value: execution.action.type.toString(), inline: true }
      );

    if (execution.content) {
      embed.addFields({ name: 'Content', value: truncate(execution.content, 1024), inline: false });
    }

    if (execution.matchedKeyword) {
      embed.addFields({ name: 'Matched Keyword', value: execution.matchedKeyword, inline: true });
    }

    if (execution.channelId) {
      embed.addFields({ name: 'Channel', value: `<#${execution.channelId}>`, inline: true });
    }

    await sendLog(logChannel, embed);
  },
};

export default event;
