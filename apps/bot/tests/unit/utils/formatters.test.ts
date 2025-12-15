import { describe, it, expect } from 'vitest';
import { formatUser, formatUserSimple, formatChannelType, truncate } from '../../../src/utils/formatters';
import { createMockUser } from '../../mocks/member';

describe('formatters', () => {
  describe('formatUser', () => {
    it('should format user with mention, tag, and id', () => {
      const user = createMockUser({ id: '123', username: 'testuser' });
      const result = formatUser(user);
      expect(result).toContain('<@123>');
      expect(result).toContain('testuser');
      expect(result).toContain('123');
    });
  });

  describe('formatUserSimple', () => {
    it('should format user with tag and id only', () => {
      const user = createMockUser({ id: '123', username: 'testuser' });
      const result = formatUserSimple(user);
      expect(result).toContain('testuser');
      expect(result).toContain('123');
      expect(result).not.toContain('<@');
    });
  });

  describe('formatChannelType', () => {
    it('should return Text for type 0', () => {
      expect(formatChannelType(0)).toBe('Text');
    });

    it('should return Voice for type 2', () => {
      expect(formatChannelType(2)).toBe('Voice');
    });

    it('should return Unknown for invalid type', () => {
      expect(formatChannelType(999)).toBe('Unknown');
    });
  });

  describe('truncate', () => {
    it('should not truncate short strings', () => {
      expect(truncate('short', 100)).toBe('short');
    });

    it('should truncate long strings', () => {
      const long = 'a'.repeat(100);
      const result = truncate(long, 50);
      expect(result.length).toBe(50);
      expect(result.endsWith('...')).toBe(true);
    });
  });
});
