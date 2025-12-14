import { config, validateConfig } from './config/config';
import { LogClient } from './client';
import { connectDatabase } from './database';
import { loadEvents } from './events';
import { loadCommands } from './commands';
import { logger } from './utils';
import { Events } from 'discord.js';

async function main() {
  logger.info('Starting Log7 bot...');

  validateConfig();

  await connectDatabase(config.mongoUri);

  const client = new LogClient();

  client.events = await loadEvents(client);
  client.commands = await loadCommands(client);

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      logger.error(`Command ${interaction.commandName} error:`, error);
      const content = 'There was an error executing this command.';
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content, ephemeral: true });
      } else {
        await interaction.reply({ content, ephemeral: true });
      }
    }
  });

  client.once(Events.ClientReady, (readyClient) => {
    logger.success(`Logged in as ${readyClient.user.tag}`);
    logger.info(`Serving ${readyClient.guilds.cache.size} guilds`);
  });

  await client.login(config.token);
}

main().catch((error) => {
  logger.error('Fatal error:', error);
  process.exit(1);
});
