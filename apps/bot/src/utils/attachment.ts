import { Attachment, AttachmentBuilder, Collection, Snowflake } from 'discord.js';
import { metrics } from './metrics';

// Configuration
export const ATTACHMENT_CONFIG = {
  DOWNLOAD_TIMEOUT: 30_000,      // 30s per file
  MAX_CONCURRENT_DOWNLOADS: 5,   // Parallel downloads
  MAX_RETRIES: 2,                // Retry attempts
  RETRY_DELAY: 1000,             // Base delay between retries (ms)
};

// Concurrency limiter
function createLimiter(concurrency: number) {
  let active = 0;
  const queue: Array<() => void> = [];

  return async function limit<T>(fn: () => Promise<T>): Promise<T> {
    while (active >= concurrency) {
      await new Promise<void>(resolve => queue.push(resolve));
    }
    active++;
    metrics.setActiveDownloads(active);
    try {
      return await fn();
    } finally {
      active--;
      metrics.setActiveDownloads(active);
      queue.shift()?.();
    }
  };
}

// Fetch with timeout and abort
async function fetchWithTimeout(url: string, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Sleep helper for retry delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Download single attachment with retry
async function downloadAttachment(
  attachment: Attachment,
  options: { timeout: number; retries: number; retryDelay: number }
): Promise<AttachmentBuilder | null> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= options.retries; attempt++) {
    try {
      const startTime = Date.now();
      
      const response = await fetchWithTimeout(attachment.url, options.timeout);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      const downloadTime = Date.now() - startTime;
      
      metrics.increment('attachmentsDownloaded');
      metrics.addBytes(buffer.length);
      metrics.recordDownloadTime(downloadTime);

      const builder = new AttachmentBuilder(buffer, {
        name: attachment.name ?? `attachment_${attachment.id}`,
        description: attachment.description ?? undefined,
      });

      if (attachment.spoiler) {
        builder.setSpoiler(true);
      }

      return builder;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on abort (timeout)
      if (lastError.name === 'AbortError') {
        break;
      }
      
      // Wait before retry with exponential backoff
      if (attempt < options.retries) {
        await sleep(options.retryDelay * Math.pow(2, attempt));
      }
    }
  }

  metrics.increment('attachmentsFailed');
  return null;
}

export interface DownloadOptions {
  timeout?: number;
  maxConcurrent?: number;
  retries?: number;
  retryDelay?: number;
}

export async function preserveAttachment(
  attachment: Attachment,
  options?: DownloadOptions
): Promise<AttachmentBuilder | null> {
  return downloadAttachment(attachment, {
    timeout: options?.timeout ?? ATTACHMENT_CONFIG.DOWNLOAD_TIMEOUT,
    retries: options?.retries ?? ATTACHMENT_CONFIG.MAX_RETRIES,
    retryDelay: options?.retryDelay ?? ATTACHMENT_CONFIG.RETRY_DELAY,
  });
}

export async function preserveAttachments(
  attachments: Collection<Snowflake, Attachment> | Attachment[],
  options?: DownloadOptions
): Promise<AttachmentBuilder[]> {
  const attachmentArray = Array.isArray(attachments) 
    ? attachments 
    : Array.from(attachments.values());

  if (attachmentArray.length === 0) return [];

  const config = {
    timeout: options?.timeout ?? ATTACHMENT_CONFIG.DOWNLOAD_TIMEOUT,
    maxConcurrent: options?.maxConcurrent ?? ATTACHMENT_CONFIG.MAX_CONCURRENT_DOWNLOADS,
    retries: options?.retries ?? ATTACHMENT_CONFIG.MAX_RETRIES,
    retryDelay: options?.retryDelay ?? ATTACHMENT_CONFIG.RETRY_DELAY,
  };

  const limiter = createLimiter(config.maxConcurrent);

  // Download all in parallel with concurrency limit
  const results = await Promise.allSettled(
    attachmentArray.map(attachment =>
      limiter(() => downloadAttachment(attachment, config))
    )
  );

  // Filter successful downloads
  return results
    .filter((r): r is PromiseFulfilledResult<AttachmentBuilder | null> => r.status === 'fulfilled')
    .map(r => r.value)
    .filter((b): b is AttachmentBuilder => b !== null);
}
