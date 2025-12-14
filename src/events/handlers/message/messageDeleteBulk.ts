import { Client, Message, PartialMessage, Snowflake, GuildTextBasedChannel, ReadonlyCollection } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createDeleteEmbed, formatChannel } from '../../../utils';

export const event: EventHandler<'messageDeleteBulk'> = {
  name: 'messageDeleteBulk',
  async execute(
    client: Client<true>,
    messages: ReadonlyCollection<Snowflake, Message<true> | PartialMessage>,
    channel: GuildTextBasedChannel
  ) {
    const guild = channel.guild;

    const logChannel = await getLogChannel(client, guild.id, 'message');
    if (!logChannel) return;

    const canLog = await shouldLog(guild.id, 'message', {
      channelId: channel.id,
      categoryId: 'parentId' in channel ? channel.parentId : null,
    });
    if (!canLog) return;

    const embed = createDeleteEmbed('Bulk Messages Deleted')
      .addFields(
        { name: 'Channel', value: formatChannel(channel), inline: true },
        { name: 'Count', value: `${messages.size} messages`, inline: true }
      );

    const authors = new Set<string>();
    messages.forEach((msg) => {
      if (msg.author) {
        authors.add(`${msg.author.tag} (${msg.author.id})`);
      }
    });

    if (authors.size > 0) {
      const authorList = Array.from(authors).slice(0, 10).join('\n');
      embed.addFields({
        name: `Authors (${authors.size})`,
        value: authorList + (authors.size > 10 ? `\n...and ${authors.size - 10} more` : ''),
        inline: false,
      });
    }

    await sendLog(logChannel, embed);
  },
};

export default event;
