import { describe, it, expect } from 'vitest';
import { getDiff, formatDiffValue } from '../../../src/utils/diffing';

describe('diffing', () => {
  describe('getDiff', () => {
    it('should detect changed fields', () => {
      const oldObj = { name: 'old', value: 1 };
      const newObj = { name: 'new', value: 1 };
      const diffs = getDiff(oldObj, newObj, ['name', 'value']);
      
      expect(diffs).toHaveLength(1);
      expect(diffs[0].key).toBe('name');
      expect(diffs[0].old).toBe('old');
      expect(diffs[0].new).toBe('new');
    });

    it('should return empty array for identical objects', () => {
      const obj = { name: 'same', value: 1 };
      const diffs = getDiff(obj, obj, ['name', 'value']);
      expect(diffs).toHaveLength(0);
    });

    it('should handle null values', () => {
      const oldObj = { name: null };
      const newObj = { name: 'new' };
      const diffs = getDiff(oldObj, newObj, ['name']);
      
      expect(diffs).toHaveLength(1);
    });
  });

  describe('formatDiffValue', () => {
    it('should format null as None', () => {
      expect(formatDiffValue(null)).toBe('None');
    });

    it('should format undefined as None', () => {
      expect(formatDiffValue(undefined)).toBe('None');
    });

    it('should format boolean true as Yes', () => {
      expect(formatDiffValue(true)).toBe('Yes');
    });

    it('should format boolean false as No', () => {
      expect(formatDiffValue(false)).toBe('No');
    });

    it('should format empty string as Empty', () => {
      expect(formatDiffValue('')).toBe('Empty');
    });

    it('should format arrays', () => {
      expect(formatDiffValue(['a', 'b'])).toBe('a, b');
    });

    it('should format empty arrays as None', () => {
      expect(formatDiffValue([])).toBe('None');
    });
  });
});
