import 'dotenv/config';
import { loadCommands, deployCommands } from './index';
import { logger } from '../utils';

async function main() {
  const token = process.env.DISCORD_TOKEN;
  const clientId = process.env.CLIENT_ID;
  const guildId = process.env.GUILD_ID;

  if (!token || !clientId) {
    logger.error('Missing DISCORD_TOKEN or CLIENT_ID in environment');
    process.exit(1);
  }

  const commands = await loadCommands();
  await deployCommands(token, clientId, commands, guildId);
}

main().catch((error) => {
  logger.error('Deployment failed:', error);
  process.exit(1);
});
