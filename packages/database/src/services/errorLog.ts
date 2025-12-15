import { ErrorLog } from '../models/ErrorLog';
import { IErrorLog, IErrorContext, ErrorLevel, ErrorType } from '@log7/shared';

export interface LogErrorParams {
  level?: ErrorLevel;
  type: ErrorType;
  source: string;
  error: Error | string;
  context?: IErrorContext;
}

export interface ErrorLogDoc {
  _id: string;
  timestamp: Date;
  level: ErrorLevel;
  type: ErrorType;
  source: string;
  message: string;
  stack?: string;
  context: IErrorContext;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface ErrorStats {
  total: number;
  unresolved: number;
  byLevel: Record<ErrorLevel, number>;
  byType: Record<ErrorType, number>;
  last24h: number;
  topSources: Array<{ source: string; count: number }>;
}

export const ErrorLogService = {
  async log(params: LogErrorParams): Promise<IErrorLog> {
    const { level = 'error', type, source, error, context = {} } = params;
    
    const message = error instanceof Error ? error.message : error;
    const stack = error instanceof Error ? error.stack : undefined;

    const errorLog = new ErrorLog({
      level,
      type,
      source,
      message,
      stack,
      context,
      resolved: false,
    });

    await errorLog.save();
    return errorLog;
  },

  async getRecent(limit = 20): Promise<ErrorLogDoc[]> {
    return ErrorLog.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean() as unknown as ErrorLogDoc[];
  },

  async getUnresolved(limit = 50): Promise<ErrorLogDoc[]> {
    return ErrorLog.find({ resolved: false })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean() as unknown as ErrorLogDoc[];
  },

  async getByGuild(guildId: string, limit = 20): Promise<ErrorLogDoc[]> {
    return ErrorLog.find({ 'context.guildId': guildId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean() as unknown as ErrorLogDoc[];
  },

  async getByType(type: ErrorType, limit = 20): Promise<ErrorLogDoc[]> {
    return ErrorLog.find({ type })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean() as unknown as ErrorLogDoc[];
  },

  async getBySource(source: string, limit = 20): Promise<ErrorLogDoc[]> {
    return ErrorLog.find({ source })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean() as unknown as ErrorLogDoc[];
  },

  async markResolved(id: string, resolvedBy?: string): Promise<boolean> {
    const result = await ErrorLog.updateOne(
      { _id: id },
      { resolved: true, resolvedAt: new Date(), resolvedBy }
    );
    return result.modifiedCount > 0;
  },

  async markAllResolved(filter: Partial<{ type: ErrorType; source: string; guildId: string }>): Promise<number> {
    const query: Record<string, unknown> = { resolved: false };
    if (filter.type) query.type = filter.type;
    if (filter.source) query.source = filter.source;
    if (filter.guildId) query['context.guildId'] = filter.guildId;

    const result = await ErrorLog.updateMany(query, {
      resolved: true,
      resolvedAt: new Date(),
    });
    return result.modifiedCount;
  },

  async getStats(): Promise<ErrorStats> {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [total, unresolved, last24h, byLevel, byType, topSources] = await Promise.all([
      ErrorLog.countDocuments(),
      ErrorLog.countDocuments({ resolved: false }),
      ErrorLog.countDocuments({ timestamp: { $gte: yesterday } }),
      ErrorLog.aggregate([
        { $group: { _id: '$level', count: { $sum: 1 } } },
      ]),
      ErrorLog.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } },
      ]),
      ErrorLog.aggregate([
        { $group: { _id: '$source', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

    const levelCounts: Record<ErrorLevel, number> = { error: 0, warn: 0, fatal: 0 };
    byLevel.forEach((item: { _id: ErrorLevel; count: number }) => {
      levelCounts[item._id] = item.count;
    });

    const typeCounts: Record<ErrorType, number> = { event: 0, command: 0, database: 0, system: 0 };
    byType.forEach((item: { _id: ErrorType; count: number }) => {
      typeCounts[item._id] = item.count;
    });

    return {
      total,
      unresolved,
      byLevel: levelCounts,
      byType: typeCounts,
      last24h,
      topSources: topSources.map((s: { _id: string; count: number }) => ({ source: s._id, count: s.count })),
    };
  },

  async deleteOld(days = 90): Promise<number> {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const result = await ErrorLog.deleteMany({ timestamp: { $lt: cutoff } });
    return result.deletedCount;
  },
};
