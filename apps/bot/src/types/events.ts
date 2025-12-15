import { ClientEvents, Client, Collection } from 'discord.js';
import { EventCategory } from '@log7/shared';

export interface EventHandler<K extends keyof ClientEvents = keyof ClientEvents> {
  name: K;
  once?: boolean;
  execute: (client: Client<true>, ...args: ClientEvents[K]) => Promise<void>;
}

export { EventCategory };

export const EVENT_TO_CATEGORY: Record<string, EventCategory> = {
  // Channel events
  channelCreate: 'channel',
  channelDelete: 'channel',
  channelUpdate: 'channel',
  channelPinsUpdate: 'channel',

  // Guild events
  guildUpdate: 'guild',
  guildIntegrationsUpdate: 'guild',

  // Member events
  guildMemberAdd: 'member',
  guildMemberRemove: 'member',
  guildMemberUpdate: 'member',

  // Message events
  messageDelete: 'message',
  messageUpdate: 'message',
  messageDeleteBulk: 'message',

  // Reaction events
  messageReactionAdd: 'reaction',
  messageReactionRemove: 'reaction',
  messageReactionRemoveAll: 'reaction',
  messageReactionRemoveEmoji: 'reaction',

  // Role events
  roleCreate: 'role',
  roleDelete: 'role',
  roleUpdate: 'role',

  // Voice events
  voiceStateUpdate: 'voice',

  // Thread events
  threadCreate: 'thread',
  threadDelete: 'thread',
  threadUpdate: 'thread',
  threadListSync: 'thread',
  threadMembersUpdate: 'thread',

  // Emoji events
  emojiCreate: 'emoji',
  emojiDelete: 'emoji',
  emojiUpdate: 'emoji',

  // Sticker events
  stickerCreate: 'sticker',
  stickerDelete: 'sticker',
  stickerUpdate: 'sticker',

  // Invite events
  inviteCreate: 'invite',
  inviteDelete: 'invite',

  // Scheduled event events
  guildScheduledEventCreate: 'scheduled',
  guildScheduledEventDelete: 'scheduled',
  guildScheduledEventUpdate: 'scheduled',
  guildScheduledEventUserAdd: 'scheduled',
  guildScheduledEventUserRemove: 'scheduled',

  // Stage events
  stageInstanceCreate: 'stage',
  stageInstanceDelete: 'stage',
  stageInstanceUpdate: 'stage',

  // Ban events
  guildBanAdd: 'ban',
  guildBanRemove: 'ban',

  // AutoMod events
  autoModerationActionExecution: 'automod',
  autoModerationRuleCreate: 'automod',
  autoModerationRuleDelete: 'automod',
  autoModerationRuleUpdate: 'automod',

  // Interaction events
  interactionCreate: 'interaction',

  // Presence events
  presenceUpdate: 'presence',
  typingStart: 'presence',

  // User events
  userUpdate: 'user',

  // Webhook events
  webhookUpdate: 'webhook',
};

export type LoggableEvent = keyof typeof EVENT_TO_CATEGORY;
