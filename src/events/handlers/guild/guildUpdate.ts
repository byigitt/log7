import { Client, Guild } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createUpdateEmbed } from '../../../utils';

export const event: EventHandler<'guildUpdate'> = {
  name: 'guildUpdate',
  async execute(client: Client<true>, oldGuild: Guild, newGuild: Guild) {
    const logChannel = await getLogChannel(client, newGuild.id, 'guild');
    if (!logChannel) return;

    const canLog = await shouldLog(newGuild.id, 'guild', {});
    if (!canLog) return;

    const changes: string[] = [];

    if (oldGuild.name !== newGuild.name) {
      changes.push(`**Name:** ${oldGuild.name} → ${newGuild.name}`);
    }

    if (oldGuild.icon !== newGuild.icon) {
      changes.push(`**Icon:** Changed`);
    }

    if (oldGuild.banner !== newGuild.banner) {
      changes.push(`**Banner:** Changed`);
    }

    if (oldGuild.description !== newGuild.description) {
      changes.push(`**Description:** ${oldGuild.description || 'None'} → ${newGuild.description || 'None'}`);
    }

    if (oldGuild.verificationLevel !== newGuild.verificationLevel) {
      changes.push(`**Verification Level:** ${oldGuild.verificationLevel} → ${newGuild.verificationLevel}`);
    }

    if (oldGuild.explicitContentFilter !== newGuild.explicitContentFilter) {
      changes.push(`**Explicit Content Filter:** ${oldGuild.explicitContentFilter} → ${newGuild.explicitContentFilter}`);
    }

    if (oldGuild.afkChannelId !== newGuild.afkChannelId) {
      const oldAfk = oldGuild.afkChannel?.name ?? 'None';
      const newAfk = newGuild.afkChannel?.name ?? 'None';
      changes.push(`**AFK Channel:** ${oldAfk} → ${newAfk}`);
    }

    if (oldGuild.afkTimeout !== newGuild.afkTimeout) {
      changes.push(`**AFK Timeout:** ${oldGuild.afkTimeout}s → ${newGuild.afkTimeout}s`);
    }

    if (oldGuild.systemChannelId !== newGuild.systemChannelId) {
      const oldSys = oldGuild.systemChannel?.name ?? 'None';
      const newSys = newGuild.systemChannel?.name ?? 'None';
      changes.push(`**System Channel:** ${oldSys} → ${newSys}`);
    }

    if (oldGuild.vanityURLCode !== newGuild.vanityURLCode) {
      changes.push(`**Vanity URL:** ${oldGuild.vanityURLCode || 'None'} → ${newGuild.vanityURLCode || 'None'}`);
    }

    if (changes.length === 0) return;

    const embed = createUpdateEmbed('Server Updated')
      .setThumbnail(newGuild.iconURL())
      .addFields({ name: 'Changes', value: changes.join('\n'), inline: false });

    await sendLog(logChannel, embed);
  },
};

export default event;
