import { Presence } from 'discord.js';
import { createUpdateHandler } from '../../createHandler';
import { Embeds, field, userField } from '../../../utils';

export const event = createUpdateHandler<Presence | null>({
  name: 'presenceUpdate',
  category: 'presence',
  skip: (old, cur) => !cur?.guild || cur.user?.bot === true || old?.status === cur?.status,
  getGuild: (_, p) => p?.guild || null,
  getFilterParams: (_, p) => ({ userId: p?.userId }),
  createEmbed: (old, cur) => {
    if (!cur) return null;
    return Embeds.info('Presence Updated', {
      fields: [
        cur.user ? userField('User', cur.user) : field('User', `<@${cur.userId}>`),
        field('Status', `${old?.status || 'offline'} → ${cur.status}`),
      ],
    });
  },
});

export default event;
