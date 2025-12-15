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
export { Guild, ErrorLog } from './models';

// Services
export { GuildService, ErrorLogService } from './services';
export type { LogErrorParams, ErrorLogDoc, ErrorStats } from './services';
