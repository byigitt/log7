import { vi } from 'vitest';
import { GuildMember, User, Guild, Collection, Role } from 'discord.js';
import { createMockGuild } from './guild';

export interface MockUserOptions {
  id?: string;
  username?: string;
  discriminator?: string;
  bot?: boolean;
  avatar?: string | null;
  globalName?: string | null;
}

export interface MockMemberOptions extends MockUserOptions {
  guildId?: string;
  nickname?: string | null;
  roles?: string[];
  joinedAt?: Date;
}

export function createMockUser(options: MockUserOptions = {}): User {
  const {
    id = '222222222222222222',
    username = 'testuser',
    discriminator = '0',
    bot = false,
    avatar = null,
    globalName = null,
  } = options;

  const tag = discriminator === '0' ? username : `${username}#${discriminator}`;

  const user = {
    id,
    username,
    discriminator,
    bot,
    avatar,
    globalName,
    tag,
    createdAt: new Date('2020-01-01'),
    createdTimestamp: new Date('2020-01-01').getTime(),
    displayAvatarURL: vi.fn().mockReturnValue('https://cdn.discordapp.com/embed/avatars/0.png'),
    toString: () => `<@${id}>`,
  } as unknown as User;

  return user;
}

export function createMockMember(options: MockMemberOptions = {}): GuildMember {
  const {
    guildId = '999999999999999999',
    nickname = null,
    roles = [],
    joinedAt = new Date(),
    ...userOptions
  } = options;

  const user = createMockUser(userOptions);
  const guild = createMockGuild({ id: guildId });

  const rolesCache = new Collection<string, Role>();
  roles.forEach((roleId) => {
    rolesCache.set(roleId, { id: roleId, name: `Role ${roleId}` } as Role);
  });
  rolesCache.set(guildId, { id: guildId, name: '@everyone' } as Role);

  return {
    id: user.id,
    user,
    guild,
    nickname,
    joinedAt,
    joinedTimestamp: joinedAt.getTime(),
    roles: {
      cache: rolesCache,
    },
    displayAvatarURL: vi.fn().mockReturnValue('https://cdn.discordapp.com/embed/avatars/0.png'),
    communicationDisabledUntil: null,
    avatar: null,
    toString: () => `<@${user.id}>`,
  } as unknown as GuildMember;
}
