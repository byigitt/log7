import { describe, it, expect, beforeEach } from 'vitest';
import { ErrorLog, ErrorLogService } from '@log7/database';

describe('ErrorLogService', () => {
  beforeEach(async () => {
    await ErrorLog.deleteMany({});
  });

  describe('log', () => {
    it('should log an error with Error object', async () => {
      const error = new Error('Test error message');
      error.stack = 'Error: Test error message\n    at Test.run';

      const result = await ErrorLogService.log({
        type: 'event',
        source: 'messageCreate',
        error,
        context: {
          guildId: '123456789',
          guildName: 'Test Guild',
        },
      });

      expect(result.message).toBe('Test error message');
      expect(result.stack).toContain('Test error message');
      expect(result.type).toBe('event');
      expect(result.source).toBe('messageCreate');
      expect(result.level).toBe('error');
      expect(result.resolved).toBe(false);
      expect(result.context.guildId).toBe('123456789');
    });

    it('should log an error with string message', async () => {
      const result = await ErrorLogService.log({
        type: 'command',
        source: 'logging',
        error: 'Something went wrong',
        level: 'warn',
      });

      expect(result.message).toBe('Something went wrong');
      expect(result.stack).toBeUndefined();
      expect(result.level).toBe('warn');
    });

    it('should log a fatal error', async () => {
      const result = await ErrorLogService.log({
        type: 'system',
        source: 'main',
        error: new Error('Fatal crash'),
        level: 'fatal',
      });

      expect(result.level).toBe('fatal');
      expect(result.type).toBe('system');
    });
  });

  describe('getRecent', () => {
    it('should return recent errors sorted by timestamp', async () => {
      await ErrorLogService.log({ type: 'event', source: 'first', error: 'First' });
      await ErrorLogService.log({ type: 'event', source: 'second', error: 'Second' });
      await ErrorLogService.log({ type: 'event', source: 'third', error: 'Third' });

      const results = await ErrorLogService.getRecent(2);

      expect(results).toHaveLength(2);
      expect(results[0].source).toBe('third');
      expect(results[1].source).toBe('second');
    });
  });

  describe('getUnresolved', () => {
    it('should return only unresolved errors', async () => {
      const error1 = await ErrorLogService.log({ type: 'event', source: 'test1', error: 'Error 1' });
      await ErrorLogService.log({ type: 'event', source: 'test2', error: 'Error 2' });

      await ErrorLogService.markResolved(error1._id.toString());

      const results = await ErrorLogService.getUnresolved();

      expect(results).toHaveLength(1);
      expect(results[0].source).toBe('test2');
    });
  });

  describe('getByGuild', () => {
    it('should filter errors by guild ID', async () => {
      await ErrorLogService.log({
        type: 'event',
        source: 'test',
        error: 'Guild A error',
        context: { guildId: 'guild-a' },
      });
      await ErrorLogService.log({
        type: 'event',
        source: 'test',
        error: 'Guild B error',
        context: { guildId: 'guild-b' },
      });

      const results = await ErrorLogService.getByGuild('guild-a');

      expect(results).toHaveLength(1);
      expect(results[0].context.guildId).toBe('guild-a');
    });
  });

  describe('getByType', () => {
    it('should filter errors by type', async () => {
      await ErrorLogService.log({ type: 'event', source: 'test', error: 'Event error' });
      await ErrorLogService.log({ type: 'command', source: 'test', error: 'Command error' });
      await ErrorLogService.log({ type: 'event', source: 'test2', error: 'Another event' });

      const results = await ErrorLogService.getByType('event');

      expect(results).toHaveLength(2);
      results.forEach(r => expect(r.type).toBe('event'));
    });
  });

  describe('getBySource', () => {
    it('should filter errors by source', async () => {
      await ErrorLogService.log({ type: 'event', source: 'messageCreate', error: 'Error 1' });
      await ErrorLogService.log({ type: 'event', source: 'messageDelete', error: 'Error 2' });
      await ErrorLogService.log({ type: 'event', source: 'messageCreate', error: 'Error 3' });

      const results = await ErrorLogService.getBySource('messageCreate');

      expect(results).toHaveLength(2);
      results.forEach(r => expect(r.source).toBe('messageCreate'));
    });
  });

  describe('markResolved', () => {
    it('should mark an error as resolved', async () => {
      const error = await ErrorLogService.log({
        type: 'event',
        source: 'test',
        error: 'Test error',
      });

      const result = await ErrorLogService.markResolved(error._id.toString(), 'admin');

      expect(result).toBe(true);

      const updated = await ErrorLog.findById(error._id);
      expect(updated?.resolved).toBe(true);
      expect(updated?.resolvedBy).toBe('admin');
      expect(updated?.resolvedAt).toBeDefined();
    });

    it('should return false for non-existent ID', async () => {
      const result = await ErrorLogService.markResolved('507f1f77bcf86cd799439011');
      expect(result).toBe(false);
    });
  });

  describe('markAllResolved', () => {
    it('should mark all matching errors as resolved', async () => {
      await ErrorLogService.log({ type: 'event', source: 'test', error: 'Error 1' });
      await ErrorLogService.log({ type: 'event', source: 'test', error: 'Error 2' });
      await ErrorLogService.log({ type: 'command', source: 'test', error: 'Error 3' });

      const count = await ErrorLogService.markAllResolved({ type: 'event' });

      expect(count).toBe(2);

      const unresolved = await ErrorLogService.getUnresolved();
      expect(unresolved).toHaveLength(1);
      expect(unresolved[0].type).toBe('command');
    });
  });

  describe('getStats', () => {
    it('should return error statistics', async () => {
      await ErrorLogService.log({ type: 'event', source: 'test1', error: 'Error', level: 'error' });
      await ErrorLogService.log({ type: 'event', source: 'test1', error: 'Warn', level: 'warn' });
      await ErrorLogService.log({ type: 'command', source: 'test2', error: 'Error', level: 'error' });
      
      const error = await ErrorLogService.log({ type: 'system', source: 'test3', error: 'Fatal', level: 'fatal' });
      await ErrorLogService.markResolved(error._id.toString());

      const stats = await ErrorLogService.getStats();

      expect(stats.total).toBe(4);
      expect(stats.unresolved).toBe(3);
      expect(stats.byLevel.error).toBe(2);
      expect(stats.byLevel.warn).toBe(1);
      expect(stats.byLevel.fatal).toBe(1);
      expect(stats.byType.event).toBe(2);
      expect(stats.byType.command).toBe(1);
      expect(stats.byType.system).toBe(1);
      expect(stats.last24h).toBe(4);
      expect(stats.topSources.length).toBeGreaterThan(0);
    });
  });

  describe('deleteOld', () => {
    it('should delete errors older than specified days', async () => {
      // Create an old error by manipulating timestamp
      const oldError = new ErrorLog({
        type: 'event',
        source: 'old',
        message: 'Old error',
        level: 'error',
        timestamp: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000), // 100 days ago
        context: {},
        resolved: false,
      });
      await oldError.save();

      await ErrorLogService.log({ type: 'event', source: 'new', error: 'New error' });

      const deleted = await ErrorLogService.deleteOld(90);

      expect(deleted).toBe(1);

      const remaining = await ErrorLog.find();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].source).toBe('new');
    });
  });
});
