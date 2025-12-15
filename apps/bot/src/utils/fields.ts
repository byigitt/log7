import { APIEmbedField, User, GuildMember, Channel, Role } from 'discord.js';

export function field(name: string, value: unknown, inline = true): APIEmbedField {
  let strValue: string;

  if (value === null || value === undefined) {
    strValue = 'None';
  } else if (typeof value === 'boolean') {
    strValue = value ? 'Yes' : 'No';
  } else if (Array.isArray(value)) {
    strValue = value.length > 0 ? value.join(', ') : 'None';
  } else {
    strValue = String(value);
  }

  return { name, value: strValue || 'None', inline };
}

export function userField(label: string, user: User | GuildMember): APIEmbedField {
  const u = 'user' in user && user.user ? user.user : (user as User);
  return field(label, `${u} (${u.tag} | ${u.id})`);
}

export function channelField(label: string, channel: Channel | { id: string; name?: string }): APIEmbedField {
  if ('name' in channel && channel.name) {
    return field(label, `<#${channel.id}> (${channel.name} | ${channel.id})`);
  }
  return field(label, `<#${channel.id}> (${channel.id})`);
}

export function roleField(label: string, role: Role): APIEmbedField {
  return field(label, `${role} (${role.name} | ${role.id})`);
}

export function timestampField(label: string, date: Date | null): APIEmbedField {
  if (!date) return field(label, 'None');
  return field(label, `<t:${Math.floor(date.getTime() / 1000)}:F>`);
}

export function relativeTimeField(label: string, date: Date | null): APIEmbedField {
  if (!date) return field(label, 'None');
  return field(label, `<t:${Math.floor(date.getTime() / 1000)}:R>`);
}

export function diffField(label: string, oldVal: unknown, newVal: unknown): APIEmbedField | null {
  if (oldVal === newVal) return null;
  const format = (v: unknown) => v === null || v === undefined ? 'None' : String(v);
  return field(label, `${format(oldVal)} → ${format(newVal)}`, false);
}

export function changesField(changes: Array<{ label: string; old: unknown; new: unknown }>): APIEmbedField | null {
  const lines = changes
    .filter(c => c.old !== c.new)
    .map(c => {
      const format = (v: unknown) => v === null || v === undefined ? 'None' : 
        typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v);
      return `**${c.label}:** ${format(c.old)} → ${format(c.new)}`;
    });
  
  if (lines.length === 0) return null;
  return { name: 'Changes', value: lines.join('\n'), inline: false };
}
