export interface Metrics {
  // Attachment metrics
  attachmentsDownloaded: number;
  attachmentsFailed: number;
  bytesDownloaded: number;
  
  // Queue metrics
  logsQueued: number;
  logsProcessed: number;
  logsFailed: number;
  logsDropped: number;
  
  // Timing
  avgDownloadTime: number;
  avgQueueTime: number;
  
  // Current state
  currentQueueSize: number;
  activeDownloads: number;
}

class MetricsCollector {
  private data: Metrics = {
    attachmentsDownloaded: 0,
    attachmentsFailed: 0,
    bytesDownloaded: 0,
    logsQueued: 0,
    logsProcessed: 0,
    logsFailed: 0,
    logsDropped: 0,
    avgDownloadTime: 0,
    avgQueueTime: 0,
    currentQueueSize: 0,
    activeDownloads: 0,
  };

  private downloadTimes: number[] = [];
  private queueTimes: number[] = [];
  private readonly maxSamples = 100;

  increment(key: keyof Pick<Metrics, 'attachmentsDownloaded' | 'attachmentsFailed' | 'logsQueued' | 'logsProcessed' | 'logsFailed' | 'logsDropped'>): void {
    this.data[key]++;
  }

  addBytes(bytes: number): void {
    this.data.bytesDownloaded += bytes;
  }

  setQueueSize(size: number): void {
    this.data.currentQueueSize = size;
  }

  setActiveDownloads(count: number): void {
    this.data.activeDownloads = count;
  }

  recordDownloadTime(ms: number): void {
    this.downloadTimes.push(ms);
    if (this.downloadTimes.length > this.maxSamples) {
      this.downloadTimes.shift();
    }
    this.data.avgDownloadTime = this.downloadTimes.reduce((a, b) => a + b, 0) / this.downloadTimes.length;
  }

  recordQueueTime(ms: number): void {
    this.queueTimes.push(ms);
    if (this.queueTimes.length > this.maxSamples) {
      this.queueTimes.shift();
    }
    this.data.avgQueueTime = this.queueTimes.reduce((a, b) => a + b, 0) / this.queueTimes.length;
  }

  get(): Metrics {
    return { ...this.data };
  }

  reset(): void {
    this.data = {
      attachmentsDownloaded: 0,
      attachmentsFailed: 0,
      bytesDownloaded: 0,
      logsQueued: 0,
      logsProcessed: 0,
      logsFailed: 0,
      logsDropped: 0,
      avgDownloadTime: 0,
      avgQueueTime: 0,
      currentQueueSize: 0,
      activeDownloads: 0,
    };
    this.downloadTimes = [];
    this.queueTimes = [];
  }

  toString(): string {
    const m = this.data;
    return [
      `[Metrics]`,
      `  Attachments: ${m.attachmentsDownloaded} ok, ${m.attachmentsFailed} failed, ${(m.bytesDownloaded / 1024 / 1024).toFixed(2)} MB`,
      `  Downloads: ${m.activeDownloads} active, avg ${m.avgDownloadTime.toFixed(0)}ms`,
      `  Queue: ${m.currentQueueSize} pending, ${m.logsProcessed} processed, ${m.logsFailed} failed, ${m.logsDropped} dropped`,
      `  Avg queue time: ${m.avgQueueTime.toFixed(0)}ms`,
    ].join('\n');
  }
}

export const metrics = new MetricsCollector();
