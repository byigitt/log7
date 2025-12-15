import { vi } from 'vitest';
import { Client, TextChannel, EmbedBuilder, Role, GuildEmoji, Invite, ThreadChannel, ChannelType, GuildBan, Sticker, StickerFormatType, GuildScheduledEvent, GuildScheduledEventStatus, GuildScheduledEventEntityType, StageInstance, StageInstancePrivacyLevel, AutoModerationRule, AutoModerationRuleTriggerType, AutoModerationRuleEventType, AutoModerationActionType } from 'discord.js';
import { GuildConfigService, FilterService } from '@log7/database';
import { EventCategory } from '@log7/shared';
import { createMockClient, addMockChannel } from '../mocks/client';
import { createMockTextChannel } from '../mocks/channel';
import { createMockGuild } from '../mocks/guild';
import { createMockUser } from '../mocks/member';

// Constants
export const TEST_IDS = {
  GUILD: '999999999999999999',
  LOG_CHANNEL: '888888888888888888',
  CHANNEL: '111111111111111111',
  USER: '222222222222222222',
  ROLE: '444444444444444444',
  EMOJI: '555555555555555555',
  THREAD: '666666666666666666',
  STICKER: '777777777777777777',
  EVENT: '123456789012345678',
  STAGE: '234567890123456789',
  AUTOMOD: '345678901234567890',
} as const;

// Test context
export interface TestContext {
  client: Client<true>;
  logChannel: TextChannel;
  guildId: string;
}

export async function createTestContext(category: EventCategory): Promise<TestContext> {
  const client = createMockClient();
  const logChannel = createMockTextChannel({ id: TEST_IDS.LOG_CHANNEL, guildId: TEST_IDS.GUILD });
  addMockChannel(client, logChannel);
  await GuildConfigService.set(TEST_IDS.GUILD, category, TEST_IDS.LOG_CHANNEL);
  return { client, logChannel, guildId: TEST_IDS.GUILD };
}

export async function disableCategory(category: EventCategory): Promise<void> {
  await GuildConfigService.disable(TEST_IDS.GUILD, category);
}

export async function blacklistUser(category: EventCategory | 'all', userId = TEST_IDS.USER): Promise<void> {
  await FilterService.add(TEST_IDS.GUILD, 'blacklist', 'user', userId, category);
}

export async function blacklistChannel(category: EventCategory | 'all', channelId = TEST_IDS.CHANNEL): Promise<void> {
  await FilterService.add(TEST_IDS.GUILD, 'blacklist', 'channel', channelId, category);
}

// Assertions
export function expectLogSent(ctx: TestContext): void {
  expect(ctx.logChannel.send).toHaveBeenCalled();
}

export function expectLogNotSent(ctx: TestContext): void {
  expect(ctx.logChannel.send).not.toHaveBeenCalled();
}

// Mock factories
export function createMockRole(overrides: Partial<{ id: string; name: string; color: number }> = {}): Role {
  const guild = createMockGuild({ id: TEST_IDS.GUILD });
  const id = overrides.id ?? TEST_IDS.ROLE;
  const name = overrides.name ?? 'Test Role';
  const color = overrides.color ?? 0xff0000;
  
  return {
    id, name, guild, color,
    hexColor: `#${color.toString(16).padStart(6, '0')}`,
    hoist: false, mentionable: false, position: 1,
    permissions: { bitfield: BigInt(0) },
    toString: () => `<@&${id}>`,
  } as unknown as Role;
}

export function createMockEmoji(overrides: Partial<{ id: string; name: string }> = {}): GuildEmoji {
  const guild = createMockGuild({ id: TEST_IDS.GUILD });
  const id = overrides.id ?? TEST_IDS.EMOJI;
  const name = overrides.name ?? 'test_emoji';

  return {
    id, name, guild, animated: false,
    identifier: `${name}:${id}`,
    url: `https://cdn.discordapp.com/emojis/${id}.png`,
    toString: () => `<:${name}:${id}>`,
    imageURL: vi.fn().mockReturnValue(`https://cdn.discordapp.com/emojis/${id}.png`),
  } as unknown as GuildEmoji;
}

export function createMockInvite(overrides: Partial<{ code: string; inviterId: string }> = {}): Invite {
  const guild = createMockGuild({ id: TEST_IDS.GUILD });
  const inviter = overrides.inviterId ? createMockUser({ id: overrides.inviterId }) : createMockUser({ id: TEST_IDS.USER });
  const code = overrides.code ?? 'abc123';

  return {
    code, guild, inviter,
    channel: { id: TEST_IDS.CHANNEL, name: 'general' },
    maxAge: 86400, maxUses: 0, uses: 0, temporary: false,
    expiresAt: new Date(Date.now() + 86400000),
    url: `https://discord.gg/${code}`,
  } as unknown as Invite;
}

export function createMockThread(overrides: Partial<{ id: string; name: string; ownerId: string; archived: boolean }> = {}): ThreadChannel {
  const guild = createMockGuild({ id: TEST_IDS.GUILD });
  const id = overrides.id ?? TEST_IDS.THREAD;
  const name = overrides.name ?? 'Test Thread';

  return {
    id, name, guild, guildId: TEST_IDS.GUILD,
    ownerId: overrides.ownerId ?? TEST_IDS.USER,
    type: ChannelType.PublicThread,
    parentId: TEST_IDS.CHANNEL,
    parent: { id: TEST_IDS.CHANNEL, name: 'parent-channel' },
    archived: overrides.archived ?? false,
    locked: false,
    toString: () => `<#${id}>`,
  } as unknown as ThreadChannel;
}

export function createMockBan(overrides: Partial<{ userId: string; reason: string | null }> = {}): GuildBan {
  const guild = createMockGuild({ id: TEST_IDS.GUILD });
  const user = createMockUser({ id: overrides.userId ?? TEST_IDS.USER });
  return { guild, user, reason: overrides.reason ?? null } as unknown as GuildBan;
}

export function createMockSticker(overrides: Partial<{ id: string; name: string }> = {}): Sticker {
  const guild = createMockGuild({ id: TEST_IDS.GUILD });
  const id = overrides.id ?? TEST_IDS.STICKER;
  const name = overrides.name ?? 'Test Sticker';

  return {
    id, name, guild, guildId: TEST_IDS.GUILD,
    description: 'A test sticker',
    format: StickerFormatType.PNG,
    tags: 'test',
    url: `https://cdn.discordapp.com/stickers/${id}.png`,
  } as unknown as Sticker;
}

export function createMockScheduledEvent(overrides: Partial<{ id: string; name: string; creatorId: string }> = {}): GuildScheduledEvent {
  const guild = createMockGuild({ id: TEST_IDS.GUILD });
  const id = overrides.id ?? TEST_IDS.EVENT;
  const name = overrides.name ?? 'Test Event';
  const creator = createMockUser({ id: overrides.creatorId ?? TEST_IDS.USER });

  return {
    id, name, guild, guildId: TEST_IDS.GUILD,
    creator, creatorId: creator.id,
    description: 'A test event',
    scheduledStartAt: new Date(Date.now() + 86400000),
    scheduledEndAt: null,
    status: GuildScheduledEventStatus.Scheduled,
    entityType: GuildScheduledEventEntityType.Voice,
    channel: { id: TEST_IDS.CHANNEL, name: 'Voice Channel' },
  } as unknown as GuildScheduledEvent;
}

export function createMockStageInstance(overrides: Partial<{ id: string; topic: string }> = {}): StageInstance {
  const guild = createMockGuild({ id: TEST_IDS.GUILD });
  const id = overrides.id ?? TEST_IDS.STAGE;

  return {
    id, guild, guildId: TEST_IDS.GUILD,
    channelId: TEST_IDS.CHANNEL,
    channel: { id: TEST_IDS.CHANNEL, name: 'Stage Channel' },
    topic: overrides.topic ?? 'Test Topic',
    privacyLevel: StageInstancePrivacyLevel.GuildOnly,
  } as unknown as StageInstance;
}

export function createMockAutoModRule(overrides: Partial<{ id: string; name: string; creatorId: string }> = {}): AutoModerationRule {
  const guild = createMockGuild({ id: TEST_IDS.GUILD });
  const id = overrides.id ?? TEST_IDS.AUTOMOD;
  const name = overrides.name ?? 'Test Rule';

  return {
    id, name, guild, guildId: TEST_IDS.GUILD,
    creatorId: overrides.creatorId ?? TEST_IDS.USER,
    eventType: AutoModerationRuleEventType.MessageSend,
    triggerType: AutoModerationRuleTriggerType.Keyword,
    triggerMetadata: { keywordFilter: ['test'] },
    actions: [{ type: AutoModerationActionType.BlockMessage }],
    enabled: true,
    exemptRoles: [], exemptChannels: [],
  } as unknown as AutoModerationRule;
}
