export interface Guild {
  id: string;
  name: string;
}

export interface Channel {
  id: string;
  name: string;
  guildId: string;
}

export interface LogEntry {
  id: string;
  type: string;
  guildId: string;
  channelId?: string;
  userId?: string;
  timestamp: Date;
  data: Record<string, unknown>;
}
