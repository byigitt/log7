import { Client, AutoModerationRule } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createUpdateEmbed } from '../../../utils';

export const event: EventHandler<'autoModerationRuleUpdate'> = {
  name: 'autoModerationRuleUpdate',
  async execute(client: Client<true>, oldRule: AutoModerationRule | null, newRule: AutoModerationRule) {
    const logChannel = await getLogChannel(client, newRule.guild.id, 'automod');
    if (!logChannel) return;

    const canLog = await shouldLog(newRule.guild.id, 'automod', {});
    if (!canLog) return;

    const changes: string[] = [];

    if (oldRule?.name !== newRule.name) {
      changes.push(`**Name:** ${oldRule?.name || 'Unknown'} → ${newRule.name}`);
    }
    if (oldRule?.enabled !== newRule.enabled) {
      changes.push(`**Enabled:** ${oldRule?.enabled} → ${newRule.enabled}`);
    }

    if (changes.length === 0) {
      changes.push('Rule configuration updated');
    }

    const embed = createUpdateEmbed('AutoMod Rule Updated')
      .addFields(
        { name: 'Rule', value: newRule.name, inline: true },
        { name: 'Changes', value: changes.join('\n'), inline: false }
      );

    await sendLog(logChannel, embed);
  },
};

export default event;
