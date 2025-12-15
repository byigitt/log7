import {
  Client,
  Collection,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
} from 'discord.js';
import { EventHandler } from './events';

export interface Command {
  data: SlashCommandBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export interface ExtendedClient extends Client<true> {
  commands: Collection<string, Command>;
  events: Collection<string, EventHandler>;
}
