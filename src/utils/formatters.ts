import {
  User,
  GuildMember,
  Channel,
  Role,
  GuildChannel,
  time,
  TimestampStyles,
} from 'discord.js';

export function formatUser(user: User | GuildMember): string {
  const u = 'user' in user && user.user ? user.user : (user as User);
  return `${u} (${u.tag} | ${u.id})`;
}

export function formatUserSimple(user: User | GuildMember): string {
  const u = 'user' in user && user.user ? user.user : (user as User);
  return `${u.tag} (${u.id})`;
}

export function formatChannel(channel: Channel): string {
  if ('name' in channel && channel.name) {
    return `<#${channel.id}> (${channel.name} | ${channel.id})`;
  }
  return `<#${channel.id}> (${channel.id})`;
}

export function formatRole(role: Role): string {
  return `${role} (${role.name} | ${role.id})`;
}

export function formatTimestamp(
  date: Date,
  style: (typeof TimestampStyles)[keyof typeof TimestampStyles] = TimestampStyles.ShortDateTime
): string {
  return time(date, style);
}

export function formatRelativeTime(date: Date): string {
  return time(date, TimestampStyles.RelativeTime);
}

export function formatChannelType(type: number): string {
  const types: Record<number, string> = {
    0: 'Text',
    2: 'Voice',
    4: 'Category',
    5: 'Announcement',
    10: 'Announcement Thread',
    11: 'Public Thread',
    12: 'Private Thread',
    13: 'Stage',
    14: 'Directory',
    15: 'Forum',
    16: 'Media',
  };
  return types[type] ?? 'Unknown';
}

export function truncate(str: string, maxLength: number = 1024): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

export function formatPermissions(permissions: bigint): string {
  return permissions.toString();
}

export function getParentId(channel: Channel): string | null {
  if ('parentId' in channel) {
    return (channel as GuildChannel).parentId;
  }
  return null;
}
