import { describe, it, expect } from 'vitest';
import {
  getPathExtension,
  getPathFilename,
  isJsonString
} from '../../src/utils';

describe('utils', () => {
  describe('getPathExtension', () => {
    it('should extract extension from Unix path', () => {
      expect(getPathExtension('/path/to/file.jspf')).toBe('jspf');
    });

    it('should extract extension from Windows path', () => {
      expect(getPathExtension('C:\\path\\to\\file.m3u')).toBe('m3u');
    });

    it('should return lowercase extension', () => {
      expect(getPathExtension('/path/to/file.JSPF')).toBe('jspf');
      expect(getPathExtension('/path/to/file.XSPF')).toBe('xspf');
    });

    it('should handle files with multiple dots', () => {
      expect(getPathExtension('/path/to/file.backup.jspf')).toBe('jspf');
    });

    it('should return null for files without extension', () => {
      expect(getPathExtension('/path/to/file')).toBeNull();
    });

    it('should return null for paths ending with dot', () => {
      expect(getPathExtension('/path/to/file.')).toBeNull();
    });

    it('should handle relative paths', () => {
      expect(getPathExtension('./file.pls')).toBe('pls');
      expect(getPathExtension('../file.m3u8')).toBe('m3u8');
    });
  });

  describe('getPathFilename', () => {
    it('should extract filename from Unix path', () => {
      expect(getPathFilename('/path/to/file.jspf')).toBe('file.jspf');
    });

    it('should extract filename from Windows path', () => {
      expect(getPathFilename('C:\\path\\to\\file.m3u')).toBe('file.m3u');
    });

    it('should return the path if no directory separator', () => {
      expect(getPathFilename('file.jspf')).toBe('file.jspf');
    });

    it('should handle relative paths', () => {
      expect(getPathFilename('./file.jspf')).toBe('file.jspf');
      expect(getPathFilename('../file.jspf')).toBe('file.jspf');
    });

    it('should handle paths with only filename', () => {
      expect(getPathFilename('playlist.jspf')).toBe('playlist.jspf');
    });
  });

  describe('isJsonString', () => {
    it('should return true for valid JSON string', () => {
      expect(isJsonString('"hello"')).toBe(true);
      expect(isJsonString('"test string"')).toBe(true);
    });

    it('should return false for non-JSON strings', () => {
      expect(isJsonString('hello')).toBe(false);
      expect(isJsonString('test')).toBe(false);
      expect(isJsonString('123')).toBe(false);
    });

    it('should handle whitespace', () => {
      expect(isJsonString('  "hello"  ')).toBe(true);
      expect(isJsonString('  hello  ')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isJsonString('')).toBe(false);
      expect(isJsonString('  ')).toBe(false);
    });

    it('should return false for single character', () => {
      expect(isJsonString('"')).toBe(false);
    });

    it('should return true for minimum valid JSON string', () => {
      expect(isJsonString('""')).toBe(true);
    });
  });
});

