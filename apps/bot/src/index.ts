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
  client.commands = await loadCommands();

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      await logger.logError(error instanceof Error ? error : new Error(String(error)), {
        type: 'command',
        source: interaction.commandName,
        guildId: interaction.guildId ?? undefined,
        guildName: interaction.guild?.name,
        userId: interaction.user.id,
        userName: interaction.user.tag,
        channelId: interaction.channelId,
      });
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

main().catch(async (error) => {
  await logger.fatal(error instanceof Error ? error : new Error(String(error)), {
    type: 'system',
    source: 'main',
  });
  process.exit(1);
});
