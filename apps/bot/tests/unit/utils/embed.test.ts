import { describe, it, expect } from 'vitest';
import { createEmbed, createCreateEmbed, createDeleteEmbed, createUpdateEmbed, createInfoEmbed } from '../../../src/utils/embed';
import { ACTION_COLORS } from '../../../src/constants';

describe('embed utils', () => {
  describe('createEmbed', () => {
    it('should create embed with color and title', () => {
      const embed = createEmbed(0xff0000, 'Test Title');
      expect(embed.data.color).toBe(0xff0000);
      expect(embed.data.title).toBe('Test Title');
    });

    it('should include description when provided', () => {
      const embed = createEmbed(0xff0000, 'Title', 'Description');
      expect(embed.data.description).toBe('Description');
    });

    it('should include timestamp', () => {
      const embed = createEmbed(0xff0000, 'Title');
      expect(embed.data.timestamp).toBeDefined();
    });
  });

  describe('createCreateEmbed', () => {
    it('should use green color', () => {
      const embed = createCreateEmbed('Created');
      expect(embed.data.color).toBe(ACTION_COLORS.CREATE);
    });
  });

  describe('createDeleteEmbed', () => {
    it('should use red color', () => {
      const embed = createDeleteEmbed('Deleted');
      expect(embed.data.color).toBe(ACTION_COLORS.DELETE);
    });
  });

  describe('createUpdateEmbed', () => {
    it('should use yellow color', () => {
      const embed = createUpdateEmbed('Updated');
      expect(embed.data.color).toBe(ACTION_COLORS.UPDATE);
    });
  });

  describe('createInfoEmbed', () => {
    it('should use blue color', () => {
      const embed = createInfoEmbed('Info');
      expect(embed.data.color).toBe(ACTION_COLORS.INFO);
    });
  });
});
