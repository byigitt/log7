import { Client, AutoModerationRule } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createDeleteEmbed } from '../../../utils';

export const event: EventHandler<'autoModerationRuleDelete'> = {
  name: 'autoModerationRuleDelete',
  async execute(client: Client<true>, rule: AutoModerationRule) {
    const logChannel = await getLogChannel(client, rule.guild.id, 'automod');
    if (!logChannel) return;

    const canLog = await shouldLog(rule.guild.id, 'automod', {});
    if (!canLog) return;

    const embed = createDeleteEmbed('AutoMod Rule Deleted')
      .addFields(
        { name: 'Name', value: rule.name, inline: true },
        { name: 'ID', value: rule.id, inline: true }
      );

    await sendLog(logChannel, embed);
  },
};

export default event;
