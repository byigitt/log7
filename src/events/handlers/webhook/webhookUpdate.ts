import { ForumChannel, NewsChannel, TextChannel, VoiceChannel } from 'discord.js';
import { createHandler } from '../../createHandler';
import { Embeds, field, channelField } from '../../../utils';

type WebhookChannel = TextChannel | NewsChannel | VoiceChannel | ForumChannel;

export const event = createHandler<WebhookChannel>({
  name: 'webhooksUpdate',
  category: 'webhook',
  getGuild: (c) => c.guild,
  getFilterParams: (c) => ({ channelId: c.id }),
  createEmbed: (c) => Embeds.info('Webhooks Updated', {
    fields: [
      channelField('Channel', c),
      field('ID', c.id),
    ],
  }),
});

export default event;
