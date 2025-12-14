import { VoiceState } from 'discord.js';
import { createUpdateHandler } from '../../createHandler';
import { Embeds, field, userField, channelField } from '../../../utils';

export const event = createUpdateHandler<VoiceState>({
  name: 'voiceStateUpdate',
  category: 'voice',
  skip: (old, cur) => !cur.guild || cur.member?.user.bot === true,
  getGuild: (_, s) => s.guild,
  getFilterParams: (_, s) => ({ userId: s.member?.id, channelId: s.channelId || undefined }),
  createEmbed: (old, cur) => {
    const member = cur.member || old.member;
    if (!member) return null;

    // Voice channel change
    if (old.channelId !== cur.channelId) {
      if (!old.channelId && cur.channelId) {
        return Embeds.created('Voice Joined', {
          fields: [
            userField('Member', member),
            cur.channel ? channelField('Channel', cur.channel) : field('Channel', `<#${cur.channelId}>`),
          ],
        });
      }
      if (old.channelId && !cur.channelId) {
        return Embeds.deleted('Voice Left', {
          fields: [
            userField('Member', member),
            old.channel ? channelField('Channel', old.channel) : field('Channel', `<#${old.channelId}>`),
          ],
        });
      }
      return Embeds.updated('Voice Moved', {
        fields: [
          userField('Member', member),
          old.channel ? channelField('From', old.channel) : field('From', `<#${old.channelId}>`),
          cur.channel ? channelField('To', cur.channel) : field('To', `<#${cur.channelId}>`),
        ],
      });
    }

    // Mute/Deaf changes
    if (old.selfMute !== cur.selfMute || old.selfDeaf !== cur.selfDeaf || 
        old.serverMute !== cur.serverMute || old.serverDeaf !== cur.serverDeaf) {
      return Embeds.info('Voice State Changed', {
        fields: [
          userField('Member', member),
          cur.channel ? channelField('Channel', cur.channel) : null,
          field('Self Mute', cur.selfMute),
          field('Self Deaf', cur.selfDeaf),
          field('Server Mute', cur.serverMute),
          field('Server Deaf', cur.serverDeaf),
        ],
      });
    }

    return null;
  },
});

export default event;
