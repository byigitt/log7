import { Collection, REST, Routes } from 'discord.js';
import { Command } from '../types';
import { logger } from '../utils';
import * as fs from 'fs';
import * as path from 'path';

export async function loadCommands(): Promise<Collection<string, Command>> {
  const commands = new Collection<string, Command>();
  const commandsPath = path.join(__dirname);

  const folders = fs.readdirSync(commandsPath).filter((item) => {
    const itemPath = path.join(commandsPath, item);
    return fs.statSync(itemPath).isDirectory();
  });

  for (const folder of folders) {
    const folderPath = path.join(commandsPath, folder);
    const files = fs.readdirSync(folderPath).filter((f) => f.endsWith('.ts') || f.endsWith('.js'));

    for (const file of files) {
      const filePath = path.join(folderPath, file);

      try {
        const commandModule = await import(filePath);
        const command: Command = commandModule.default || commandModule.command;

        if (!command?.data || !command?.execute) {
          logger.warn(`Invalid command file: ${filePath}`);
          continue;
        }

        commands.set(command.data.name, command);
        logger.debug(`Loaded command: ${command.data.name}`);
      } catch (error) {
        logger.error(`Failed to load command ${filePath}:`, error);
      }
    }
  }

  logger.success(`Loaded ${commands.size} commands`);
  return commands;
}

export async function deployCommands(
  token: string,
  clientId: string,
  commands: Collection<string, Command>,
  guildId?: string
): Promise<void> {
  const rest = new REST().setToken(token);

  const commandData = commands.map((cmd) => cmd.data.toJSON());

  try {
    logger.info(`Deploying ${commandData.length} commands...`);

    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commandData,
      });
      logger.success(`Deployed commands to guild ${guildId}`);
    } else {
      await rest.put(Routes.applicationCommands(clientId), {
        body: commandData,
      });
      logger.success('Deployed commands globally');
    }
  } catch (error) {
    logger.error('Failed to deploy commands:', error);
    throw error;
  }
}
