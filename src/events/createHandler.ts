import { Client, EmbedBuilder, Guild, AttachmentBuilder } from 'discord.js';
import { EventCategory, FilterCheckParams } from '../types';
import { getLogChannel, shouldLog, sendLog } from './base';

export interface HandlerConfig<T> {
  name: string;
  category: EventCategory;
  getGuild: (data: T) => Guild | { id: string } | null;
  getFilterParams?: (data: T) => FilterCheckParams;
  createEmbed: (data: T) => EmbedBuilder;
  getAttachments?: (data: T) => AttachmentBuilder[] | undefined;
  skip?: (data: T) => boolean;
}

export interface UpdateHandlerConfig<T> {
  name: string;
  category: EventCategory;
  getGuild: (oldData: T, newData: T) => Guild | { id: string } | null;
  getFilterParams?: (oldData: T, newData: T) => FilterCheckParams;
  createEmbed: (oldData: T, newData: T) => EmbedBuilder | null;
  skip?: (oldData: T, newData: T) => boolean;
}

export interface DualArgHandlerConfig<T, U> {
  name: string;
  category: EventCategory;
  getGuild: (arg1: T, arg2: U) => Guild | { id: string } | null;
  getFilterParams?: (arg1: T, arg2: U) => FilterCheckParams;
  createEmbed: (arg1: T, arg2: U) => EmbedBuilder | null;
  skip?: (arg1: T, arg2: U) => boolean;
}

export function createHandler<T>(config: HandlerConfig<T>) {
  return {
    name: config.name,
    async execute(client: Client<true>, data: T) {
      if (config.skip?.(data)) return;

      const guild = config.getGuild(data);
      if (!guild) return;

      const guildId = typeof guild === 'string' ? guild : guild.id;
      const logChannel = await getLogChannel(client, guildId, config.category);
      if (!logChannel) return;

      const filterParams = config.getFilterParams?.(data) ?? {};
      if (!await shouldLog(guildId, config.category, filterParams)) return;

      const embed = config.createEmbed(data);
      const attachments = config.getAttachments?.(data);
      await sendLog(logChannel, embed, attachments);
    },
  };
}

export function createUpdateHandler<T>(config: UpdateHandlerConfig<T>) {
  return {
    name: config.name,
    async execute(client: Client<true>, oldData: T, newData: T) {
      if (config.skip?.(oldData, newData)) return;

      const guild = config.getGuild(oldData, newData);
      if (!guild) return;

      const guildId = typeof guild === 'string' ? guild : guild.id;
      const logChannel = await getLogChannel(client, guildId, config.category);
      if (!logChannel) return;

      const filterParams = config.getFilterParams?.(oldData, newData) ?? {};
      if (!await shouldLog(guildId, config.category, filterParams)) return;

      const embed = config.createEmbed(oldData, newData);
      if (!embed) return;
      
      await sendLog(logChannel, embed);
    },
  };
}

export function createDualArgHandler<T, U>(config: DualArgHandlerConfig<T, U>) {
  return {
    name: config.name,
    async execute(client: Client<true>, arg1: T, arg2: U) {
      if (config.skip?.(arg1, arg2)) return;

      const guild = config.getGuild(arg1, arg2);
      if (!guild) return;

      const guildId = typeof guild === 'string' ? guild : guild.id;
      const logChannel = await getLogChannel(client, guildId, config.category);
      if (!logChannel) return;

      const filterParams = config.getFilterParams?.(arg1, arg2) ?? {};
      if (!await shouldLog(guildId, config.category, filterParams)) return;

      const embed = config.createEmbed(arg1, arg2);
      if (!embed) return;
      
      await sendLog(logChannel, embed);
    },
  };
}
