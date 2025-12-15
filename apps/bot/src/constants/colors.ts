import { EventCategory } from '../types';

export const Colors = {
  GREEN: 0x57f287,
  RED: 0xed4245,
  YELLOW: 0xfee75c,
  BLUE: 0x5865f2,
  ORANGE: 0xe67e22,
  PURPLE: 0x9b59b6,
  GREY: 0x95a5a6,
  WHITE: 0xffffff,
} as const;

export const ACTION_COLORS = {
  CREATE: Colors.GREEN,
  DELETE: Colors.RED,
  UPDATE: Colors.YELLOW,
  INFO: Colors.BLUE,
} as const;

export const CATEGORY_COLORS: Record<EventCategory, number> = {
  channel: Colors.BLUE,
  guild: Colors.PURPLE,
  member: Colors.GREEN,
  message: Colors.ORANGE,
  reaction: Colors.YELLOW,
  role: Colors.PURPLE,
  voice: Colors.BLUE,
  thread: Colors.BLUE,
  emoji: Colors.YELLOW,
  sticker: Colors.YELLOW,
  invite: Colors.GREEN,
  scheduled: Colors.PURPLE,
  stage: Colors.BLUE,
  ban: Colors.RED,
  automod: Colors.RED,
  interaction: Colors.GREY,
  presence: Colors.GREY,
  user: Colors.BLUE,
  webhook: Colors.ORANGE,
};
