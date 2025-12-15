import { AutoModerationActionExecution } from 'discord.js';
import { createHandler } from '../../createHandler';
import { Embeds, field } from '../../../utils';

export const event = createHandler<AutoModerationActionExecution>({
  name: 'autoModerationActionExecution',
  category: 'automod',
  getGuild: (e) => e.guild,
  getFilterParams: (e) => ({ userId: e.userId, channelId: e.channelId || undefined }),
  createEmbed: (e) => Embeds.info('AutoMod Action', {
    fields: [
      field('User', `<@${e.userId}>`),
      field('Rule', e.ruleId),
      field('Trigger', e.ruleTriggerType.toString()),
      e.channelId ? field('Channel', `<#${e.channelId}>`) : null,
      e.content ? field('Content', e.content.slice(0, 1024), false) : null,
      e.matchedKeyword ? field('Matched', e.matchedKeyword) : null,
    ],
  }),
});

export default event;
