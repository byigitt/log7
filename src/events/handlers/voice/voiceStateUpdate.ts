import { Client, VoiceState } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createEmbed, formatUser } from '../../../utils';
import { Colors } from '../../../constants';

export const event: EventHandler<'voiceStateUpdate'> = {
  name: 'voiceStateUpdate',
  async execute(client: Client<true>, oldState: VoiceState, newState: VoiceState) {
    if (!newState.guild) return;
    if (newState.member?.user.bot) return;

    const guild = newState.guild;

    const logChannel = await getLogChannel(client, guild.id, 'voice');
    if (!logChannel) return;

    const canLog = await shouldLog(guild.id, 'voice', {
      userId: newState.member?.id,
      channelId: newState.channelId || oldState.channelId || undefined,
    });
    if (!canLog) return;

    const member = newState.member || oldState.member;
    if (!member) return;

    let action = '';
    let color: number = Colors.BLUE;

    if (!oldState.channelId && newState.channelId) {
      action = `Joined ${newState.channel}`;
      color = Colors.GREEN;
    } else if (oldState.channelId && !newState.channelId) {
      action = `Left ${oldState.channel}`;
      color = Colors.RED;
    } else if (oldState.channelId !== newState.channelId) {
      action = `Moved from ${oldState.channel} to ${newState.channel}`;
      color = Colors.YELLOW;
    } else if (oldState.selfMute !== newState.selfMute) {
      action = newState.selfMute ? 'Self-muted' : 'Self-unmuted';
    } else if (oldState.selfDeaf !== newState.selfDeaf) {
      action = newState.selfDeaf ? 'Self-deafened' : 'Self-undeafened';
    } else if (oldState.serverMute !== newState.serverMute) {
      action = newState.serverMute ? 'Server-muted' : 'Server-unmuted';
    } else if (oldState.serverDeaf !== newState.serverDeaf) {
      action = newState.serverDeaf ? 'Server-deafened' : 'Server-undeafened';
    } else if (oldState.streaming !== newState.streaming) {
      action = newState.streaming ? 'Started streaming' : 'Stopped streaming';
    } else if (oldState.selfVideo !== newState.selfVideo) {
      action = newState.selfVideo ? 'Turned on camera' : 'Turned off camera';
    } else {
      return;
    }

    const embed = createEmbed(color, 'Voice State Update')
      .addFields(
        { name: 'Member', value: formatUser(member), inline: true },
        { name: 'Action', value: action, inline: true }
      );

    await sendLog(logChannel, embed);
  },
};

export default event;
