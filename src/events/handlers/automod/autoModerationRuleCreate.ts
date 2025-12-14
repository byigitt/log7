import { Client, AutoModerationRule } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createCreateEmbed } from '../../../utils';

export const event: EventHandler<'autoModerationRuleCreate'> = {
  name: 'autoModerationRuleCreate',
  async execute(client: Client<true>, rule: AutoModerationRule) {
    const logChannel = await getLogChannel(client, rule.guild.id, 'automod');
    if (!logChannel) return;

    const canLog = await shouldLog(rule.guild.id, 'automod', {});
    if (!canLog) return;

    const embed = createCreateEmbed('AutoMod Rule Created')
      .addFields(
        { name: 'Name', value: rule.name, inline: true },
        { name: 'Trigger Type', value: rule.triggerType.toString(), inline: true },
        { name: 'Enabled', value: rule.enabled ? 'Yes' : 'No', inline: true }
      );

    if (rule.creatorId) {
      embed.addFields({ name: 'Created By', value: `<@${rule.creatorId}>`, inline: true });
    }

    await sendLog(logChannel, embed);
  },
};

export default event;
