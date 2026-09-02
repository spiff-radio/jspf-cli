import { describe, it, expect } from 'vitest';
import parsePLS from '../../../src/convert/formats/pls-parser';
import serializePLS from '../../../src/convert/formats/pls-serializer';

describe('convert/formats/pls', () => {
  describe('parsePLS', () => {
    it('converts Length (seconds) to JSPF duration (milliseconds)', () => {
      const input = [
        '[playlist]',
        'NumberOfEntries=1',
        'File1=http://example.com/song.mp3',
        'Title1=Song',
        'Length1=240'
      ].join('\n');

      const playlist = parsePLS(input);
      expect(playlist.track[0].duration).toBe(240000);
    });

    it('treats Length=-1 (unknown duration) as undefined, not -1000', () => {
      const input = [
        '[playlist]',
        'NumberOfEntries=1',
        'File1=http://example.com/song.mp3',
        'Title1=Song',
        'Length1=-1'
      ].join('\n');

      const playlist = parsePLS(input);
      expect(playlist.track[0].duration).toBeUndefined();
    });
  });

  describe('serializePLS', () => {
    it('converts JSPF duration (milliseconds) to Length (seconds)', () => {
      const output = serializePLS({
        track: [{ title: 'Song', duration: 240000, location: ['http://example.com/song.mp3'] }]
      });
      expect(output).toContain('Length1=240');
    });
  });
});
