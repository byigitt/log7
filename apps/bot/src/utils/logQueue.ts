import { TextChannel, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import { metrics } from './metrics';
import { logger } from './logger';

export const QUEUE_CONFIG = {
  MAX_SIZE: 1000,           // Max queued logs before dropping
  CONCURRENCY: 3,           // Parallel sends
  PROCESS_INTERVAL: 50,     // ms between processing cycles
};

export interface LogItem {
  channel: TextChannel;
  embed: EmbedBuilder;
  attachments?: AttachmentBuilder[];
  queuedAt: number;
  guildId?: string;
  eventName?: string;
}

class LogQueue {
  private queue: LogItem[] = [];
  private processing = false;
  private activeWorkers = 0;

  add(item: Omit<LogItem, 'queuedAt'>): void {
    // Drop oldest if queue is full
    if (this.queue.length >= QUEUE_CONFIG.MAX_SIZE) {
      this.queue.shift();
      metrics.increment('logsDropped');
    }

    this.queue.push({
      ...item,
      queuedAt: Date.now(),
    });
    
    metrics.increment('logsQueued');
    metrics.setQueueSize(this.queue.length);

    // Start processing if not already
    if (!this.processing) {
      this.startProcessing();
    }
  }

  private startProcessing(): void {
    if (this.processing) return;
    this.processing = true;
    this.processLoop();
  }

  private async processLoop(): Promise<void> {
    while (this.queue.length > 0 || this.activeWorkers > 0) {
      // Spawn workers up to concurrency limit
      while (this.activeWorkers < QUEUE_CONFIG.CONCURRENCY && this.queue.length > 0) {
        const item = this.queue.shift();
        if (item) {
          metrics.setQueueSize(this.queue.length);
          this.activeWorkers++;
          this.processItem(item).finally(() => {
            this.activeWorkers--;
          });
        }
      }

      // Wait before next cycle
      await new Promise(resolve => setTimeout(resolve, QUEUE_CONFIG.PROCESS_INTERVAL));
    }

    this.processing = false;
  }

  private async processItem(item: LogItem): Promise<void> {
    const queueTime = Date.now() - item.queuedAt;
    metrics.recordQueueTime(queueTime);

    try {
      await item.channel.send({
        embeds: [item.embed],
        files: item.attachments,
      });
      metrics.increment('logsProcessed');
    } catch (error) {
      metrics.increment('logsFailed');
      await logger.logError(error instanceof Error ? error : new Error(String(error)), {
        type: 'system',
        source: `logQueue:${item.eventName ?? 'unknown'}`,
        guildId: item.guildId,
      });
    }
  }

  getStats() {
    return {
      queueSize: this.queue.length,
      processing: this.processing,
      activeWorkers: this.activeWorkers,
    };
  }

  clear(): void {
    const dropped = this.queue.length;
    this.queue = [];
    metrics.setQueueSize(0);
    if (dropped > 0) {
      for (let i = 0; i < dropped; i++) {
        metrics.increment('logsDropped');
      }
    }
  }

  async flush(): Promise<void> {
    while (this.queue.length > 0 || this.activeWorkers > 0) {
      await new Promise(resolve => setTimeout(resolve, QUEUE_CONFIG.PROCESS_INTERVAL));
    }
  }
}

export const logQueue = new LogQueue();
