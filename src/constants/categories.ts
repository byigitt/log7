import { EventCategory } from '../types';

export const EVENT_CATEGORIES: Record<EventCategory, readonly string[]> = {
  channel: ['channelCreate', 'channelDelete', 'channelUpdate', 'channelPinsUpdate'],
  guild: ['guildUpdate', 'guildIntegrationsUpdate'],
  member: ['guildMemberAdd', 'guildMemberRemove', 'guildMemberUpdate'],
  message: ['messageDelete', 'messageUpdate', 'messageDeleteBulk'],
  reaction: ['messageReactionAdd', 'messageReactionRemove', 'messageReactionRemoveAll', 'messageReactionRemoveEmoji'],
  role: ['roleCreate', 'roleDelete', 'roleUpdate'],
  voice: ['voiceStateUpdate'],
  thread: ['threadCreate', 'threadDelete', 'threadUpdate', 'threadListSync', 'threadMembersUpdate'],
  emoji: ['emojiCreate', 'emojiDelete', 'emojiUpdate'],
  sticker: ['stickerCreate', 'stickerDelete', 'stickerUpdate'],
  invite: ['inviteCreate', 'inviteDelete'],
  scheduled: ['guildScheduledEventCreate', 'guildScheduledEventDelete', 'guildScheduledEventUpdate', 'guildScheduledEventUserAdd', 'guildScheduledEventUserRemove'],
  stage: ['stageInstanceCreate', 'stageInstanceDelete', 'stageInstanceUpdate'],
  ban: ['guildBanAdd', 'guildBanRemove'],
  automod: ['autoModerationActionExecution', 'autoModerationRuleCreate', 'autoModerationRuleDelete', 'autoModerationRuleUpdate'],
  interaction: ['interactionCreate'],
  presence: ['presenceUpdate', 'typingStart'],
  user: ['userUpdate'],
  webhook: ['webhookUpdate'],
} as const;

export const ALL_CATEGORIES = Object.keys(EVENT_CATEGORIES) as EventCategory[];
