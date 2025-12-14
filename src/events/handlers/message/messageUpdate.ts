import { Client, Message, PartialMessage } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createUpdateEmbed, setEmbedAuthor, formatChannel, truncate } from '../../../utils';

export const event: EventHandler<'messageUpdate'> = {
  name: 'messageUpdate',
  async execute(client: Client<true>, oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage) {
    if (!newMessage.guild) return;
    if (newMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;

    const guild = newMessage.guild;

    const logChannel = await getLogChannel(client, guild.id, 'message');
    if (!logChannel) return;

    const canLog = await shouldLog(guild.id, 'message', {
      userId: newMessage.author?.id,
      channelId: newMessage.channel.id,
      categoryId: 'parentId' in newMessage.channel ? newMessage.channel.parentId : null,
      roleIds: newMessage.member?.roles.cache.map((r) => r.id),
    });
    if (!canLog) return;

    const embed = createUpdateEmbed('Message Edited')
      .addFields(
        { name: 'Channel', value: formatChannel(newMessage.channel), inline: true },
        { name: 'Author', value: newMessage.author ? `${newMessage.author.tag} (${newMessage.author.id})` : 'Unknown', inline: true },
        { name: 'Jump to Message', value: `[Click here](${newMessage.url})`, inline: true }
      );

    if (oldMessage.content) {
      embed.addFields({ name: 'Before', value: truncate(oldMessage.content, 1024), inline: false });
    }

    if (newMessage.content) {
      embed.addFields({ name: 'After', value: truncate(newMessage.content, 1024), inline: false });
    }

    if (newMessage.author) {
      setEmbedAuthor(embed, newMessage.author);
    }

    await sendLog(logChannel, embed);
  },
};

export default event;
