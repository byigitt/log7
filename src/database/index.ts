import mongoose from 'mongoose';

export async function connectDatabase(uri: string): Promise<void> {
  try {
    await mongoose.connect(uri);
    console.log('[Database] Connected to MongoDB');
  } catch (error) {
    console.error('[Database] Connection error:', error);
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  console.log('[Database] Disconnected from MongoDB');
}

export { mongoose };

// Models
export { GuildConfig } from './models/GuildConfig';
export { Filter } from './models/Filter';
export { ErrorLog } from './models/ErrorLog';
export type { IErrorLog, IErrorContext, ErrorLevel, ErrorType } from './models/ErrorLog';

// Services
export { GuildConfigService } from './services/guildConfig';
export { FilterService } from './services/filter';
export { ErrorLogService } from './services/errorLog';
export type { LogErrorParams, ErrorStats, ErrorLogDoc } from './services/errorLog';
