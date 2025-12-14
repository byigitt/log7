import { AutoModerationRule } from 'discord.js';
import { createHandler } from '../../createHandler';
import { Embeds, field } from '../../../utils';

export const event = createHandler<AutoModerationRule>({
  name: 'autoModerationRuleCreate',
  category: 'automod',
  getGuild: (r) => r.guild,
  createEmbed: (r) => Embeds.created('AutoMod Rule', {
    fields: [
      field('Name', r.name),
      field('Trigger Type', r.triggerType.toString()),
      field('Enabled', r.enabled),
      r.creatorId ? field('Created By', `<@${r.creatorId}>`) : null,
    ],
  }),
});

export default event;
