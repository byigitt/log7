import { vi } from 'vitest';
import { Message, Collection, Attachment, TextChannel } from 'discord.js';
import { createMockUser, createMockMember } from './member';
import { createMockTextChannel } from './channel';
import { createMockGuild } from './guild';

export interface MockMessageOptions {
  id?: string;
  content?: string;
  authorId?: string;
  channelId?: string;
  guildId?: string;
  attachments?: Attachment[];
  bot?: boolean;
}

export function createMockMessage(options: MockMessageOptions = {}): Message {
  const {
    id = '333333333333333333',
    content = 'Test message content',
    authorId = '222222222222222222',
    channelId = '111111111111111111',
    guildId = '999999999999999999',
    attachments = [],
    bot = false,
  } = options;

  const author = createMockUser({ id: authorId, bot });
  const member = createMockMember({ id: authorId, guildId, bot });
  const guild = createMockGuild({ id: guildId });
  const channel = createMockTextChannel({ id: channelId, guildId });

  const attachmentCollection = new Collection<string, Attachment>();
  attachments.forEach((att) => attachmentCollection.set(att.id, att));

  return {
    id,
    content,
    author,
    member,
    guild,
    guildId,
    channel,
    channelId,
    attachments: attachmentCollection,
    url: `https://discord.com/channels/${guildId}/${channelId}/${id}`,
    createdAt: new Date(),
    toString: () => content,
  } as unknown as Message;
}

export function createMockAttachment(options: Partial<Attachment> = {}): Attachment {
  return {
    id: '444444444444444444',
    name: 'test-file.txt',
    url: 'https://cdn.discordapp.com/attachments/test/test-file.txt',
    proxyURL: 'https://cdn.discordapp.com/attachments/test/test-file.txt',
    size: 1024,
    contentType: 'text/plain',
    spoiler: false,
    description: null,
    ...options,
  } as Attachment;
}
