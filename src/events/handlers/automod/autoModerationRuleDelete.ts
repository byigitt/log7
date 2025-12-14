import { AutoModerationRule } from 'discord.js';
import { createHandler } from '../../createHandler';
import { Embeds, field } from '../../../utils';

export const event = createHandler<AutoModerationRule>({
  name: 'autoModerationRuleDelete',
  category: 'automod',
  getGuild: (r) => r.guild,
  createEmbed: (r) => Embeds.deleted('AutoMod Rule', {
    fields: [
      field('Name', r.name),
      field('ID', r.id),
    ],
  }),
});

export default event;
