import 'dotenv/config';

export const config = {
  token: process.env.DISCORD_TOKEN || '',
  clientId: process.env.CLIENT_ID || '',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/log7',
  guildId: process.env.GUILD_ID,
  nodeEnv: process.env.NODE_ENV || 'production',
};

export function validateConfig(): void {
  if (!config.token) {
    throw new Error('DISCORD_TOKEN is required');
  }
  if (!config.clientId) {
    throw new Error('CLIENT_ID is required');
  }
}
