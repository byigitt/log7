import { AutoModerationRule } from 'discord.js';
import { createUpdateHandler } from '../../createHandler';
import { Embeds, field, changesField } from '../../../utils';

export const event = createUpdateHandler<AutoModerationRule | null>({
  name: 'autoModerationRuleUpdate',
  category: 'automod',
  skip: (old, cur) => !old || !cur,
  getGuild: (_, r) => r?.guild || null,
  createEmbed: (old, cur) => {
    if (!old || !cur) return null;
    return Embeds.updated('AutoMod Rule', {
      fields: [
        field('Name', cur.name),
        changesField([
          { label: 'Name', old: old.name, new: cur.name },
          { label: 'Enabled', old: old.enabled, new: cur.enabled },
        ]),
      ],
    });
  },
});

export default event;
