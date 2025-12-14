import { Client, Message, PartialMessage } from 'discord.js';
import { EventHandler } from '../../../types';
import { getLogChannel, shouldLog, sendLog } from '../../base';
import { createDeleteEmbed, setEmbedAuthor, formatChannel, truncate, preserveAttachments } from '../../../utils';

export const event: EventHandler<'messageDelete'> = {
  name: 'messageDelete',
  async execute(client: Client<true>, message: Message | PartialMessage) {
    if (!message.guild) return;
    if (message.author?.bot) return;

    const guild = message.guild;

    const logChannel = await getLogChannel(client, guild.id, 'message');
    if (!logChannel) return;

    const canLog = await shouldLog(guild.id, 'message', {
      userId: message.author?.id,
      channelId: message.channel.id,
      categoryId: 'parentId' in message.channel ? message.channel.parentId : null,
      roleIds: message.member?.roles.cache.map((r) => r.id),
    });
    if (!canLog) return;

    const embed = createDeleteEmbed('Message Deleted')
      .addFields(
        { name: 'Channel', value: formatChannel(message.channel), inline: true },
        { name: 'Author', value: message.author ? `${message.author.tag} (${message.author.id})` : 'Unknown', inline: true }
      );

    if (message.content) {
      embed.addFields({ name: 'Content', value: truncate(message.content, 1024), inline: false });
    }

    if (message.author) {
      setEmbedAuthor(embed, message.author);
    }

    let attachments;
    if (message.attachments.size > 0) {
      attachments = await preserveAttachments(message.attachments);
      embed.addFields({ name: 'Attachments', value: `${message.attachments.size} file(s) attached below`, inline: false });
    }

    await sendLog(logChannel, embed, attachments);
  },
};

export default event;
